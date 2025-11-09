import { CalendarCog } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="h-[calc(100vh-200px)] m-auto flex h- w-full flex-col items-center justify-center gap-2">
      <CalendarCog size={80} />
      <h1 className="text-4xl leading-tight font-bold mt-2">Coming Soon.</h1>
      <p className="text-muted-foreground text-center">
        This page has not been created yet. <br />
        Stay tuned though!
      </p>
    </div>
  );
}
