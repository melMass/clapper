import { FormSection } from "@/components/forms/FormSection"
import { getDefaultSettingsState, useSettings } from "@/controllers/settings"
import { ComputeProvider } from "@/types"

import { FormSelect } from "../forms/FormSelect"
import { availableComputeProvidersForSound, computeProviderShortNames } from "./constants"
import { FormInput } from "../forms/FormInput"

export function SettingsSectionSound() {
  const defaultSettings = getDefaultSettingsState()

  const soundProvider = useSettings(s => s.soundProvider)
  const setSoundProvider = useSettings(s => s.setSoundProvider)

  const huggingFaceModelForSound = useSettings(s => s.huggingFaceModelForSound)
  const setHuggingFaceModelForSound = useSettings(s => s.setHuggingFaceModelForSound)

  const replicateModelForSound = useSettings(s => s.replicateModelForSound)
  const setReplicateModelForSound = useSettings(s => s.setReplicateModelForSound)

  const falAiModelForSound = useSettings(s => s.falAiModelForSound)
  const setFalAiModelForSound = useSettings(s => s.setFalAiModelForSound)

  const modelsLabModelForSound = useSettings(s => s.modelsLabModelForSound)
  const setModelsLabModelForSound = useSettings(s => s.setModelsLabModelForSound)

  const comfyWorkflowForSound = useSettings(s => s.comfyWorkflowForSound)
  const setComfyWorkflowForSound = useSettings(s => s.setComfyWorkflowForSound)

  return (
    <div className="flex flex-col space-y-6 justify-between">
      <FormSection label="Sound rendering">

        <FormSelect<ComputeProvider>
          label="Sound provider"
          selectedItemId={soundProvider}
          selectedItemLabel={
            computeProviderShortNames[soundProvider]
            || ComputeProvider.NONE
          }
          items={availableComputeProvidersForSound.map(provider => ({
            id: provider,
            label: computeProviderShortNames[soundProvider] || "(missing name)",
            disabled: false,
            value: provider,
          }))}
          onSelect={setSoundProvider}
          horizontal
        />
     {soundProvider.startsWith("COMFY_")
         ? <FormInput
          label="Default Comfy workflow template for sound"
          value={comfyWorkflowForSound}
          defaultValue={defaultSettings.comfyWorkflowForSound}
          onChange={setComfyWorkflowForSound}
        />
        : // "proprietary" parameters
          <>
            {soundProvider === ComputeProvider.HUGGINGFACE && <FormInput
              label="HF Model ID (must be compatible with the Inference API)"
              value={huggingFaceModelForSound}
              defaultValue={defaultSettings.huggingFaceModelForSound}
              onChange={setHuggingFaceModelForSound}
            />}
            {soundProvider === ComputeProvider.REPLICATE && <FormInput
              label="Replicate.com model ID"
              value={replicateModelForSound}
              defaultValue={defaultSettings.replicateModelForSound}
              onChange={setReplicateModelForSound}
            />}
            {soundProvider === ComputeProvider.FALAI && <FormInput
              label="Fal.ai model ID"
              value={falAiModelForSound}
              defaultValue={defaultSettings.falAiModelForSound}
              onChange={setFalAiModelForSound}
            />}
            {soundProvider === ComputeProvider.MODELSLAB && <FormInput
              label="ModelsLab.com model ID"
              value={modelsLabModelForSound}
              defaultValue={defaultSettings.modelsLabModelForSound}
              onChange={setModelsLabModelForSound}
            />}
          </>}
      </FormSection>
    </div>
  )
}