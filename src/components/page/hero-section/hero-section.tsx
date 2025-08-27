const HeroSectionContainerClasses = "text-center mb-12";
const HeroSectionLabelClasses =
  "text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4";
const HeroSectionDescriptionClasses =
  "text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto";

export const HeroSection = () => {
  return (
    <div className={HeroSectionContainerClasses}>
      <h1 className={HeroSectionLabelClasses}>Nexla Assistant</h1>
      <p className={HeroSectionDescriptionClasses}>
        Choose how you'd like to interact with me? Each mode is optimized for
        different types of conversations and tasks.
      </p>
    </div>
  );
};
