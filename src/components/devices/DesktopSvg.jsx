import { Part, Ring, Trace, Label, Cpu, RamStick, Ssd, UefiChip, Gpu, Fan, Psu, PowerButton, ScreenContent } from './parts'

// Signal yo‘llari (stol kompyuteri koordinatalarida)
const ROUTES = {
  'power->psu': 'M355,66 L355,470 L220,470',
  'psu->board': 'M140,430 L140,410',
  'uefi->cpu': 'M108,300 L130,300 L130,145 L160,145',
  'cpu->ram': 'M230,145 L260,145',
  'cpu->gpu': 'M195,180 L195,240',
  'gpu->screen': 'M290,265 L415,265 L415,150 L445,150',
  'ssd->cpu': 'M150,362 L150,195 L175,195 L175,180',
  'cpu->ssd': 'M175,180 L175,195 L150,195 L150,362',
  'ssd->ram': 'M210,362 L240,362 L240,230 L267,230',
  'ram->cpu': 'M260,170 L230,170',
}

export default function DesktopSvg({ t, stage, isOn, selected, onSelect, reduced, stageProgress, screenMode }) {
  const active = (id) => isOn && stage.active.includes(id)
  const signals = isOn ? stage.signals : []

  return (
    <svg viewBox="0 0 800 560" className="w-full h-full" role="img" aria-label="Stol kompyuterining ichki tuzilishi">
      {/* Monitor */}
      <rect x="430" y="40" width="340" height="222" rx="10" fill="#1a2538" stroke="#3b4b66" strokeWidth="2" />
      <Part id="screen" active={active('screen')} selected={selected === 'screen'} onSelect={onSelect}>
        <ScreenContent x={445} y={52} w={310} h={190} mode={isOn ? screenMode : 'off'} t={t} reduced={reduced} progress={stageProgress} />
        <Ring x={445} y={52} w={310} h={190} visible={selected === 'screen'} />
      </Part>
      <rect x="580" y="262" width="40" height="30" fill="#263349" />
      <rect x="520" y="292" width="160" height="10" rx="4" fill="#263349" />
      <Label x={600} y={322} size={10} dim>Monitor</Label>

      {/* Korpus (yon panel olingan) */}
      <rect x="40" y="30" width="340" height="500" rx="10" fill="#0f172a" stroke="#3b4b66" strokeWidth="2" />
      <Label x={60} y={50} anchor="start" size={9} dim>Korpus — yon panel olingan</Label>

      {/* Anakart */}
      <Part id="board" active={active('board')} selected={selected === 'board'} onSelect={onSelect}>
        <rect x="60" y="62" width="300" height="350" rx="8" fill={active('board') ? '#0e2a22' : '#101a2b'} stroke={active('board') ? '#4ade80' : '#3b4b66'} strokeWidth="1.5" strokeOpacity="0.8" />
        <Label x={75} y={80} anchor="start" size={9} dim>Anakart (ATX)</Label>
        <Ring x={60} y={62} w={300} h={350} r={8} visible={selected === 'board'} />
      </Part>

      {/* Yo‘llar */}
      {Object.entries(ROUTES).map(([key, d]) => (
        <Trace key={key} d={d} t={t} active={signals.includes(key)} reduced={reduced} />
      ))}

      {/* Qismlar */}
      <Part id="cpu" active={active('cpu')} selected={selected === 'cpu'} onSelect={onSelect}>
        <Cpu x={160} y={110} active={active('cpu')} t={t} />
        <Ring x={160} y={110} w={70} h={70} visible={selected === 'cpu'} />
      </Part>

      <Part id="ram" active={active('ram')} selected={selected === 'ram'} onSelect={onSelect}>
        {[0, 1, 2, 3].map((i) => (
          <RamStick key={i} x={262 + i * 20} y={90} w={14} h={140} vertical active={active('ram')} label={i === 1 ? 'RAM' : undefined} />
        ))}
        <Ring x={262} y={90} w={74} h={140} visible={selected === 'ram'} />
      </Part>

      <Part id="uefi" active={active('uefi')} selected={selected === 'uefi'} onSelect={onSelect}>
        <UefiChip x={90} y={290} w={36} h={26} active={active('uefi')} />
        <Ring x={90} y={290} w={36} h={26} visible={selected === 'uefi'} />
      </Part>

      <Part id="gpu" active={active('gpu')} selected={selected === 'gpu'} onSelect={onSelect}>
        <Gpu x={90} y={240} w={200} h={50} active={active('gpu')} />
        <Label x={190} y={302} size={9} dim>Video karta (PCIe)</Label>
        <Ring x={90} y={240} w={200} h={50} visible={selected === 'gpu'} />
      </Part>

      <Part id="ssd" active={active('ssd')} selected={selected === 'ssd'} onSelect={onSelect}>
        <Ssd x={90} y={350} w={120} h={24} active={active('ssd')} t={t} />
        <Ring x={90} y={350} w={120} h={24} visible={selected === 'ssd'} />
      </Part>

      <Part id="fan" active={active('fan')} selected={selected === 'fan'} onSelect={onSelect}>
        <Fan cx={310} cy={335} r={32} active={active('fan')} t={t} reduced={reduced} rpm={stage.id === 'desktop' ? 1 : 2.5} />
        <Ring x={270} y={295} w={80} h={80} r={40} visible={selected === 'fan'} />
      </Part>

      <Part id="psu" active={active('psu')} selected={selected === 'psu'} onSelect={onSelect}>
        <Psu x={60} y={430} w={160} h={80} active={active('psu')} t={t} />
        <Ring x={60} y={430} w={160} h={80} visible={selected === 'psu'} />
      </Part>

      <Part id="power" active={active('power')} selected={selected === 'power'} onSelect={onSelect}>
        <PowerButton cx={355} cy={52} active={active('power')} pressed={isOn} />
        <Ring x={344} y={41} w={22} h={22} r={11} visible={selected === 'power'} />
      </Part>
    </svg>
  )
}
