interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
}

const KPICard = ({ title, value, subtitle }: KPICardProps) => {
  return (
    <div className="bg-gray-200 p-4 rounded-lg shadow-sm flex-1">
      <h2 className="text-base text-gray-800">{title}</h2>
      <p className="text-3xl font-bold text-gray-800 my-2">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  )
}

export default KPICard