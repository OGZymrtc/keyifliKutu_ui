import * as Slider from "@radix-ui/react-slider";
import { useEffect, useState } from "react";

interface MultiRangeSliderProps {
    value: number[];
    onChange: (val: number[]) => void;
    min?: number;
    max?: number;
}
export default function MultiRangeSlider({
    value,
    onChange,
    min = 0,
    max = 5000,
}: MultiRangeSliderProps) {
    const [localValue, setLocalValue] = useState<number[]>(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    return (
        <div className="w-full">
            {/* Slider */}
            <Slider.Root
                value={localValue}
                min={min}
                max={max}
                step={10}
                onValueChange={(v: number[]) => setLocalValue([v[0], v[1]] as [number, number])}
                onValueCommit={(v: number[]) => onChange([v[0], v[1]] as [number, number])}
                className="relative flex items-center w-full h-6"
            >
                {/* Track */}
                <Slider.Track className="bg-gray-300 relative grow rounded-full h-2">
                    <Slider.Range className="absolute bg-orange-500 rounded-full h-full" />
                </Slider.Track>

                {/* Left Handle */}
                <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-orange-500 rounded-full shadow cursor-pointer" />

                {/* Right Handle */}
                <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-orange-500 rounded-full shadow cursor-pointer" />
            </Slider.Root>

            {/* Inputs */}
            <div className="flex justify-between mt-3 gap-4">
                <div className="flex flex-col w-1/2">
                    <label className="text-sm text-gray-600">Min</label>
                    <input
                        type="number"
                        value={localValue[0]}
                        min={min}
                        max={localValue[1]}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            const updated: [number, number] = [val, localValue[1]];
                            setLocalValue(updated);
                            onChange(updated);
                        }}
                        className="border rounded px-2 py-1"
                    />
                </div>

                <div className="flex flex-col w-1/2">
                    <label className="text-sm text-gray-600">Max</label>
                    <input
                        type="number"
                        value={localValue[1]}
                        min={localValue[0]}
                        max={max}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            const updated: [number, number] = [localValue[0], val];
                            setLocalValue(updated);
                            onChange(updated);
                        }}
                        className="border rounded px-2 py-1"
                    />
                </div>
            </div>
        </div>
    );
}
