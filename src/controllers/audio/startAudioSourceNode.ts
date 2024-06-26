import { UUID } from "@aitube/clap"

import { RuntimeSegment } from "@/types"

import { CurrentlyPlayingAudioSource } from "./types"

/**
 * Create an audio source node from a segment
 * 
 * This will instantly play the node, at the given position
 * 
 * This means we can play a segment "late" eg. if the segment is 3 min long, we can play it at 1 min 2 min etc
 */
export function startAudioSourceNode({
  audioContext,
  segment,
  cursorTimestampAtInMs,
  onEnded
}: {
  /**
   * The AudioContext to use
   */
  audioContext: AudioContext

  /**
   * The segment to play (this is a ClapSegment with some extra fields)
   */
  segment: RuntimeSegment

  /**
   * The current elapsed playback time
   * 
   * This is the position of the playback cursor in the project, in milliseconds (eg. 20000ms)
   */
  cursorTimestampAtInMs: number

  /**
   * Called whenever the audio source will finish playing
   * 
   * Be careful, this callback may be called in a long time,
   * So make sure it uses fresh data when it is finally executed
   */
  onEnded: (sourceId: string) => void
}): CurrentlyPlayingAudioSource {
  if (!segment.audioBuffer) {
    throw new Error(`Cannot playAudioBuffer on non-audio segments`)
  }

  // const audioContext = new AudioContext() // initialize AudioContext

  // Get an AudioBufferSourceNode.
  // This is the AudioNode to use when we want to play an AudioBuffer
  // and yes, we must create a new one each time we want to play a sample
  // https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode
  const source = audioContext.createBufferSource()

  // set the buffer in the AudioBufferSourceNode
  source.buffer = segment.audioBuffer

  const gainNode: GainNode = audioContext.createGain()

  if (isFinite(segment.outputGain)) {
    gainNode.gain.value = segment.outputGain
  } else {
    console.log(`segment.outputGain isn't finite for some reason? (got value ${segment.outputGain})`)
    gainNode.gain.value = 1.0
  }

  // connect the AudioBufferSourceNode to the gain node so that we can control the volume
  source.connect(gainNode)

  // connect the gain node to the destination
  gainNode.connect(audioContext.destination)

  // make sure we play the segment at a specific time
  const startTimeInMs = cursorTimestampAtInMs - segment.startTimeInMs

  // convert milliseconds to seconds by dividing by 1000
  source.start(audioContext.currentTime, startTimeInMs >= 1000 ? (startTimeInMs / 1000) : 0)

  const currentlyPlaying: CurrentlyPlayingAudioSource = {
    sourceId: UUID(),
    segmentId: segment.id,
    sourceNode: source,
    originalGain: segment.outputGain,
    gainNode: gainNode,
  }

  // before dispatching the node we still need to attach a listener to it,
  // to detect when the sample (audio source node) stops playing
  source.onended = () => onEnded(currentlyPlaying.sourceId)

  return currentlyPlaying
}
