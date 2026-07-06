import { Button } from '@heroui/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { usePrivacyMode } from '@/lib/context/usePrivacyMode';

export function PrivacyButton() {
  const privacyModeContext = usePrivacyMode();
  return (
    <Button variant="tertiary" isIconOnly onClick={() => privacyModeContext.togglePrivacyMode()}>
      {privacyModeContext.privacyModeEnabled ? <EyeIcon /> : <EyeSlashIcon />}
    </Button>
  );
}
