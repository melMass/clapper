"use client"

import React, { useRef } from "react"
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from "react-reflex"
import { DndProvider, useDrop } from "react-dnd"
import { HTML5Backend, NativeTypes } from "react-dnd-html5-backend"
import { useTimeline } from "@aitube/timeline"

import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Monitor } from "@/components/monitor"

import { SettingsDialog } from "@/components/settings"
import { LoadingDialog } from "@/components/dialogs/loader/LoadingDialog"
import { useUI } from "@/controllers/ui"
import { TopBar } from "@/components/toolbars/top-bar"
import { Timeline } from "@/components/core/timeline"
import { useIO } from "@/controllers/io/useIO"
import { ChatView } from "@/components/assistant/ChatView"

type DroppableThing = { files: File[] }

function MainContent() {
  const ref = useRef<HTMLDivElement>(null)
  const isEmpty = useTimeline(s => s.isEmpty)
  const showTimeline = useUI((s) => s.showTimeline)
  const showChat = useUI((s) => s.showChat)
  
  const openFiles = useIO(s => s.openFiles)
  
  const [{ isOver, canDrop }, connectFileDrop] = useDrop({
    accept: [
      NativeTypes.FILE,
    ],
    drop: (item: DroppableThing): void => {
      console.log("DROP", item)
      openFiles(item.files)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  connectFileDrop(ref)

  return (
    <div
      ref={ref}
      className={cn(`
      dark
      select-none
      fixed
      flex flex-col
      w-screen h-screen
      overflow-hidden
      items-center justify-center
      font-light
      text-stone-900/90 dark:text-stone-100/90
      `)}
      style={{
        backgroundImage: "repeating-radial-gradient( circle at 0 0, transparent 0, #000000 7px ), repeating-linear-gradient( #37353455, #373534 )"
      }}
      >
      <TopBar />
        <div className={cn(
          `flex flex-row flex-grow w-full overflow-hidden`, 
          isEmpty ? "opacity-0" : "opacity-100"
        )}>
          <ReflexContainer orientation="vertical">
          
            <ReflexElement>
              <ReflexContainer orientation="horizontal">
                <ReflexElement
                  minSize={showTimeline ? 100 : 1}
                  >
                  <Monitor />
                </ReflexElement>
                <ReflexSplitter />
                <ReflexElement
                  size={showTimeline ? 400 : 1}
                  minSize={showTimeline ? 100 : 1}
                  maxSize={showTimeline ? 1600 : 1}
                  >
                  <Timeline />
                </ReflexElement>
              </ReflexContainer>
            </ReflexElement>

          {showChat && <ReflexSplitter />}
          {showChat && <ReflexElement size={300}><ChatView /></ReflexElement>}

          </ReflexContainer>
          
        </div>

      <SettingsDialog />
      <LoadingDialog />
      <Toaster />
    </div>
  );
}

export function Main() {
  return (
    <TooltipProvider>
      <DndProvider backend={HTML5Backend}>
        <MainContent />
      </DndProvider>
    </TooltipProvider>
  );
}
