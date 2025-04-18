import { DateRangePicker } from "@heroui/react";

export default function App() {
    return (
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <DateRangePicker
                className="max-w-xs"
                classNames={{
                    inputWrapper: "bg-white"
                }} visibleMonths={2} />
        </div>
    );
}
