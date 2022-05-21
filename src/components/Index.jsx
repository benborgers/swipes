import { motion } from "framer-motion";
import { DateTime } from "luxon";

export default function () {
  // CALCULATING USED SWIPES
  const percentUsed = 100;

  // CALCULATING IDEAL SWIPES
  const now = DateTime.now();

  const START_OF_SEMESTER = DateTime.fromObject(
    { year: 2022, month: 1, day: 19 },
    { zone: "America/New_York" }
  );
  const END_OF_SEMESTER = DateTime.fromObject(
    { year: 2022, month: 5, day: 12 },
    { zone: "America/New_York" }
  );

  const semesterHoursThatCount = [];

  let cursor = START_OF_SEMESTER;

  while (cursor <= END_OF_SEMESTER) {
    // We only count hours between 8am and 10pm, when dining is open.
    if (cursor.hour >= 8 && cursor.hour < 22) {
      // Leave out spring break.
      const SPRING_BREAK_START = DateTime.fromObject(
        { year: 2022, month: 3, day: 19 },
        { zone: "America/New_York" }
      );
      const SPRING_BREAK_END = DateTime.fromObject(
        { year: 2022, month: 3, day: 27 },
        { zone: "America/New_York" }
      );

      if (cursor < SPRING_BREAK_START || cursor > SPRING_BREAK_END) {
        const isWeekend = cursor.weekday === 6 || cursor.weekday === 7;

        semesterHoursThatCount.push({
          date: cursor,
          weight: isWeekend ? 1 : 4,
        });
      }
    }

    cursor = cursor.plus({ hours: 1 });
  }

  const totalWeight = (array) =>
    array.reduce((accumulator, item) => accumulator + item.weight, 0);

  const totalHoursThatCount = totalWeight(semesterHoursThatCount);
  const hoursThatHavePassed = totalWeight(
    semesterHoursThatCount.filter(({ date }) => date < now)
  );

  const progressThroughSemester = hoursThatHavePassed / totalHoursThatCount;
  const swipesToBeOnTrack = progressThroughSemester * 400;
  const percentToBeOnTrack = (swipesToBeOnTrack / 400) * 100;

  return (
    <div className="p-4 sm:p-6 h-screen grid grid-rows-[max-content,max-content,1fr]">
      <div className="max-w-xl text-xl space-y-4 text-cyan-900/80">
        <p>
          For my freshman spring semester at Tufts, I made it my mission to use
          all 400 of my meal swipes on the Premium meal plan that freshmen are
          required to have.
        </p>
        <p>I built this dashboard to help me stay on track.</p>
        <p>
          <span>You can </span>
          <a
            href="https://benborgers.com/posts/swipes-postmortem"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            read the story on my blog
          </a>
          .
        </p>
      </div>

      <div className="mt-8 space-y-4 sm:space-y-8">
        <div className="shadow-lg rounded-xl h-16 sm:h-24 bg-white overflow-hidden border-4 border-slate-900 grid">
          <motion.div
            className="bg-gradient-to-r from-sky-200 to-cyan-400 h-full col-start-1 row-start-1"
            initial={{ width: 0 }}
            animate={{ width: percentUsed + "%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          />

          <motion.p
            className="font-bold text-sky-900 col-start-1 row-start-1 ml-4 self-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            swipes used so far (400/400)
          </motion.p>
        </div>

        <div className="shadow-lg rounded-xl h-16 sm:h-24 bg-white overflow-hidden border-4 border-slate-900 grid">
          <motion.div
            className="bg-gradient-to-r from-slate-200 to-slate-300 h-full col-start-1 row-start-1"
            initial={{ width: 0 }}
            animate={{ width: percentToBeOnTrack + "%" }}
            transition={{
              type: "spring",
              bounce: 0,
              duration: 0.5,
              delay: 0.15,
            }}
          />

          <motion.p
            className="font-bold text-slate-900 col-start-1 row-start-1 ml-4 self-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            swipes to be on track ({Math.round(swipesToBeOnTrack * 10) / 10}
            /400)
          </motion.p>
        </div>
      </div>

      <div className="self-end flex flex-col sm:flex-row items-end justify-between gap-1">
        <div className="font-mono font-bold text-sm uppercase bg-red-100 text-red-600 px-3 py-0.5 rounded-full">
          January 2022 — May 2022
        </div>

        <p className="text-right text-slate-500">
          An aspirational project by{" "}
          <a href="/" className="underline">
            Ben Borgers
          </a>
          .
        </p>
      </div>
    </div>
  );
}
