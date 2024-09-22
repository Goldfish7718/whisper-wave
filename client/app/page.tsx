import ShinyButton from "@/components/magicui/shiny-button";
import WordRotate from "@/components/magicui/word-rotate";

export default function Home() {
  return (
    <>
      <section className="sm:h-[calc(100dvh-72px)] h-[calc(100dvh-64px)] flex flex-col justify-center  gap-8 sm:mx-40">
        <div className="flex flex-col justify-center sm:items-start items-center gap-2">
          <div className="flex sm:flex-row flex-col gap-2 justify-center items-center">
            <span className="text-5xl text-neutral-800 dark:text-neutral-100">
              Chat
            </span>
            <WordRotate
              className="text-5xl bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 bg-clip-text text-transparent"
              words={["Fast", "Privately", "Intelligently"]}
            />
          </div>

          <p className="text-neutral-500 dark:text-neutral-400 text-xl text-center sm:text-left p-4 sm:p-0">
            Whisper-wave is a modern text messaging platform powered by
            <br />
            <span className="text-neutral-700 dark:text-neutral-200 font-semibold">
              {" "}
              Artificial Intelligence
            </span>
          </p>
        </div>

        <div className="flex gap-4 w-full justify-center sm:justify-normal">
          <ShinyButton className="md:w-1/6 w-1/3">Sign Up</ShinyButton>
          <ShinyButton className="md:w-1/6 w-1/3">Log In</ShinyButton>
        </div>
      </section>
    </>
  );
}
