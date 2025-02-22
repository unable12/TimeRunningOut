import { useSettings } from '@/hooks/useSettings';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

export default function Settings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Settings</h2>
      
      <div className="space-y-4">
        <div>
          <Label>Time Format</Label>
          <RadioGroup
            value={settings.timeFormat}
            onValueChange={(value) => updateSettings({ timeFormat: value as '12h' | '24h' })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="12h" id="12h" />
              <Label htmlFor="12h">12-hour</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="24h" id="24h" />
              <Label htmlFor="24h">24-hour</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div>
          <Label>Week Starts On</Label>
          <RadioGroup
            value={settings.weekStart}
            onValueChange={(value) => updateSettings({ weekStart: value as 'sunday' | 'monday' })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monday" id="monday" />
              <Label htmlFor="monday">Monday</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sunday" id="sunday" />
              <Label htmlFor="sunday">Sunday</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div>
          <Label>Visualization Style</Label>
          <RadioGroup
            value={settings.visualStyle}
            onValueChange={(value) => updateSettings({ visualStyle: value as 'dots' | 'bars' })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dots" id="dots" />
              <Label htmlFor="dots">Dots</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bars" id="bars" />
              <Label htmlFor="bars">Bars</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
