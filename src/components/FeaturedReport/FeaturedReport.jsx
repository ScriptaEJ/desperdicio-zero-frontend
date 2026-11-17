import { DownloadIcon, FileIcon } from '../ReportIcons/ReportIcons';

export default function FeaturedReport({ report, onDownload }) {
  return (
    <section className="mt-7 flex flex-col items-start gap-5 rounded-[22px] bg-[#1b4d3e] px-8 py-[30px] text-white md:flex-row md:items-center">
      <div className="grid size-12 flex-none place-items-center self-start rounded-xl bg-white/10">
        <FileIcon className="size-[22px]" />
      </div>

      <div className="flex-1">
        <span className="text-[11px] font-semibold tracking-[0.14em] text-[#d5e4dc]">DESTAQUE</span>
        <h2 className="mb-2 mt-1 text-[21px] font-semibold">{report.title}</h2>
        <p className="max-w-[580px] leading-normal text-[#d5e4dc]">{report.description}</p>
      </div>

      <button
        type="button"
        onClick={() => onDownload(report)}
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#1b4d3e] hover:brightness-95"
      >
        <DownloadIcon />
        Baixar agora
      </button>
    </section>
  );
}