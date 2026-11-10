import { Part, Ring, Trace, Label, Cpu, RamStick, Ssd, UefiChip, Gpu, Fan, Battery, PowerButton, ScreenContent } from './parts'

// Signal yo‘llari (noutbuk koordinatalarida)
const ROUTES = {
  'power->psu': 'M643,322 L620,322 L620,350 L605,350 L605,360',
  'psu->board': 'M550,420 L530,420 L500,420',
  'uefi->cpu': 'M210,474 L230,474 L230,430 L250,430',
  'cpu->ram': 'M320,395 L350,395 L350,372',
  'cpu->gpu': 'M285,430 L285,445',
  'gpu->screen': 'M290,495 L290,512 L140,512 L140,292 L400,292 L400,274',
  'ssd->cpu': 'M350,444 L335,444 L335,410 L320,410',
  'cpu->ssd': 'M320,410 L335,410 L335,444 L350,444',
  'ssd->ram': 'M430,430 L430,404',
  'ram->cpu': 'M350,360 L335,360 L335,380 L320,380',
}

export default function LaptopSvg({ t, stage, isOn, selected, onSelect, reduced, stageProgress, screenMode }) {
  const active = (id) => isOn && stage.active.includes(id)
  const signals = isOn ? stage.signals : []

  return (
    <svg viewBox="0 0 800 560" className="w-full h-full" role="img" aria-label="Noutbukning ichki tuzilishi">
      <defs>
        <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a2538" />
          <stop offset="1" stopColor="#111a2c" />
        </linearGradient>
      </defs>

      {/* Ekran qopqog‘i */}
      <rect x="180" y="20" width="440" height="270" rx="14" fill="url(#lidGrad)" stroke="#3b4b66" strokeWidth="2" />
      <Part id="screen" active={active('screen')} selected={selected === 'screen'} onSelect={onSelect}>
        <ScreenContent x={200} y={36} w={400} h={238} mode={isOn ? screenMode : 'off'} t={t} reduced={reduced} progress={stageProgress} />
        <Ring x={200} y={36} w={400} h={238} visible={selected === 'screen'} />
      </Part>
      <circle cx="400" cy="28" r="3" fill="#263349" />

      {/* Sharnir */}
      <rect x="260" y="288" width="280" height="12" rx="4" fill="#263349" />

      {/* Asos (ichki ko‘rinish) */}
      <rect x="120" y="300" width="560" height="232" rx="16" fill="#0f172a" stroke="#3b4b66" strokeWidth="2" />
      <Label x={140} y={318} anchor="start" size={9} dim>Asos — ichki ko‘rinish (klaviatura olingan)</Label>

      {/* Anakart */}
      <Part id="board" active={active('board')} selected={selected === 'board'} onSelect={onSelect}>
        <rect x="150" y="328" width="385" height="190" rx="8" fill={active('board') ? '#0e2a22' : '#101a2b'} stroke={active('board') ? '#4ade80' : '#3b4b66'} strokeWidth="1.5" strokeOpacity="0.8" />
        <Label x={165} y={345} anchor="start" size={9} dim>Anakart</Label>
        <Ring x={150} y={328} w={385} h={190} r={8} visible={selected === 'board'} />
      </Part>

      {/* Yo‘llar */}
      {Object.entries(ROUTES).map(([key, d]) => (
        <Trace key={key} d={d} t={t} active={signals.includes(key)} reduced={reduced} />
      ))}

      {/* Qismlar */}
      <Part id="fan" active={active('fan')} selected={selected === 'fan'} onSelect={onSelect}>
        <Fan cx={198} cy={400} r={30} active={active('fan')} t={t} reduced={reduced} rpm={stage.id === 'desktop' ? 1 : 2.5} />
        <Ring x={160} y={362} w={76} h={76} r={40} visible={selected === 'fan'} />
      </Part>

      <Part id="cpu" active={active('cpu')} selected={selected === 'cpu'} onSelect={onSelect}>
        <Cpu x={250} y={360} active={active('cpu')} t={t} />
        <Ring x={250} y={360} w={70} h={70} visible={selected === 'cpu'} />
      </Part>

      <Part id="ram" active={active('ram')} selected={selected === 'ram'} onSelect={onSelect}>
        <RamStick x={350} y={350} w={160} h={22} active={active('ram')} />
        <RamStick x={350} y={380} w={160} h={22} active={active('ram')} label="RAM (SO-DIMM)" />
        <Ring x={350} y={350} w={160} h={52} visible={selected === 'ram'} />
      </Part>

      <Part id="ssd" active={active('ssd')} selected={selected === 'ssd'} onSelect={onSelect}>
        <Ssd x={350} y={430} w={160} h={28} active={active('ssd')} t={t} />
        <Ring x={350} y={430} w={160} h={28} visible={selected === 'ssd'} />
      </Part>

      <Part id="uefi" active={active('uefi')} selected={selected === 'uefi'} onSelect={onSelect}>
        <UefiChip x={170} y={460} active={active('uefi')} />
        <Ring x={170} y={460} w={40} h={28} visible={selected === 'uefi'} />
      </Part>

      <Part id="gpu" active={active('gpu')} selected={selected === 'gpu'} onSelect={onSelect}>
        <Gpu x={250} y={445} w={80} h={50} active={active('gpu')} />
        <Ring x={250} y={445} w={80} h={50} visible={selected === 'gpu'} />
      </Part>

      <Part id="battery" active={active('battery')} selected={selected === 'battery'} onSelect={onSelect}>
        <Battery x={550} y={360} w={110} h={140} active={active('battery')} t={t} />
        <Ring x={550} y={360} w={110} h={140} r={6} visible={selected === 'battery'} />
      </Part>

      <Part id="power" active={active('power')} selected={selected === 'power'} onSelect={onSelect}>
        <PowerButton cx={655} cy={322} active={active('power')} pressed={isOn} />
        <Ring x={644} y={311} w={22} h={22} r={11} visible={selected === 'power'} />
      </Part>
      <Label x={655} y={347} size={8} dim>Power</Label>
    </svg>
  )
}
