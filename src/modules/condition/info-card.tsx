type InfoCardProps = {
  title: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
};

const InfoCard = ({ title, value, sub, icon }: InfoCardProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-2 shadow-lg border border-white/5 hover:border-white/15 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
        {icon}
        <span>{title}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-sm text-white/50">{sub}</p>}
    </div>
  );
};

export default InfoCard;
