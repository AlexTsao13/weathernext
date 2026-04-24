type InfoCardProps = {
  title: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
};

const InfoCard = ({ title, value, sub, icon }: InfoCardProps) => {
  return (
    <div className="bg-surface backdrop-blur-md rounded-2xl p-5 flex flex-col gap-2 shadow-lg border border-surface-border hover:border-surface-border-hover transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center gap-2 text-text-secondary text-sm font-medium">
        {icon}
        <span>{title}</span>
      </div>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      {sub && <p className="text-sm text-text-tertiary">{sub}</p>}
    </div>
  );
};

export default InfoCard;
