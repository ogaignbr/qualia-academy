interface Props {
  en: string;
  title: string;
  center?: boolean;
  light?: boolean;
}

export default function SectionHeading({ en, title, center, light }: Props) {
  return (
    <div className={center ? "text-center" : ""}>
      <p
        className={`eyebrow text-xs ${
          light ? "text-gold-300" : "text-gold-500"
        }`}
      >
        {en}
      </p>
      <h2
        className={`mincho text-2xl md:text-3xl font-bold mt-1 rule-under ${
          center ? "center" : ""
        } ${light ? "text-white" : "text-navy-900"}`}
      >
        {title}
      </h2>
    </div>
  );
}
