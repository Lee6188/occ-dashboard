import { useMemo, useState } from 'react';

const PAGES = ['overview', 'workshop', 'inventory', 'safety', 'quality', 'efficiency', 'tasks', 'issueDetail'];

const KPI_CARDS = [
  { title: '安全 Safety', value: '0', target: '0事故', status: 'green', delta: '达标', sub: '隐患整改 3项', page: 'safety' },
  { title: '质量 Quality', value: '98.2%', target: '≥98%', status: 'green', delta: '+0.2%', sub: '降级 2.5T', page: 'quality' },
  { title: '交付 Delivery', value: '92%', target: '≥95%', status: 'red', delta: '↓3%', sub: '库存超目标 +80%', page: 'inventory' },
  { title: '效率 Efficiency', value: '88%', target: '≥90%', status: 'yellow', delta: '↓2%', sub: 'TGL1206S速度偏低', page: 'efficiency' }
];

const TOP_ISSUES = [
  { level: '红灯', dept: 'PPIC', title: '成品库存1800吨，超目标80%', impact: '影响仓储周转与交付节奏', owner: '黄国华', status: '处理中', type: '库存异常', occurTime: '昨日 09:20' },
  { level: '黄灯', dept: 'OPP', title: 'STTG12油污降级2.5T', impact: '质量损失持续增加', owner: '刘丹', status: '根因分析中', type: '质量异常', occurTime: '昨日 14:20' },
  { level: '黄灯', dept: 'THE', title: 'TGL1206S速度260m/min', impact: '低于目标7%', owner: '于玉乐', status: '待改善', type: '效率异常', occurTime: '昨日 13:00' }
];

const TASKS = [
  { task: '完成库存消减方案', dept: 'PPIC', due: '今日', owner: '黄国华', status: '逾期' },
  { task: '完成降级根因确认', dept: 'OPP', due: '1天', owner: '刘丹', status: '进行中' },
  { task: '优化TGL1206S提速参数', dept: 'THE', due: '2天', owner: '于玉乐', status: '待开始' }
];

const WORKSHOPS = [
  {
    name: 'OPP', status: 'yellow', output: '96%', oee: '88%', quality: '98.2%', delivery: '94%', mainIssue: 'STTG12油污降级2.5T',
    lines: [
      { name: 'STTG12', oee: '86%', output: '92%', quality: '黄灯', status: '降级偏高' },
      { name: 'SFY12W', oee: '91%', output: '98%', quality: '绿灯', status: '正常' },
      { name: 'SFP12S', oee: '89%', output: '95%', quality: '绿灯', status: '正常' }
    ]
  },
  {
    name: 'THE', status: 'yellow', output: '92%', oee: '84%', quality: '97.6%', delivery: '91%', mainIssue: 'TGL1206S生产速度低于目标7%',
    lines: [
      { name: 'TGL1206S', oee: '82%', output: '90%', quality: '绿灯', status: '速度偏低' },
      { name: 'TMT1311S', oee: '88%', output: '94%', quality: '绿灯', status: '正常' },
      { name: 'TGL1311S', oee: '85%', output: '92%', quality: '黄灯', status: '效率波动' }
    ]
  },
  {
    name: 'MET', status: 'green', output: '98%', oee: '90%', quality: '99.1%', delivery: '96%', mainIssue: '暂无重大异常',
    lines: [
      { name: 'MET-01', oee: '91%', output: '99%', quality: '绿灯', status: '正常' },
      { name: 'MET-02', oee: '89%', output: '97%', quality: '绿灯', status: '正常' },
      { name: 'MET-03', oee: '90%', output: '98%', quality: '绿灯', status: '正常' }
    ]
  }
];

const INVENTORY_DATA = [
  { category: '成品库存', actual: 1800, target: 1000, unit: '吨', diff: '+80%', status: 'red', owner: 'PPIC' },
  { category: '再造粒库存', actual: 350, target: 200, unit: '吨', diff: '+75%', status: 'red', owner: 'PPIC' },
  { category: '原材料库存', actual: 10100, target: 9000, unit: '吨', diff: '+12%', status: 'yellow', owner: 'WMS' },
  { category: '备件库存', actual: 620, target: 600, unit: '件', diff: '+3%', status: 'green', owner: 'EG' }
];

const INVENTORY_TASKS = [
  { action: '确认高库存SKU清单', owner: 'PPIC', due: '今日', status: '逾期' },
  { action: '调整本周生产计划', owner: '计划组', due: '今日', status: '进行中' },
  { action: '确认客户延期提货订单', owner: '销售', due: '1天', status: '进行中' },
  { action: '输出库存消减方案', owner: 'PPIC', due: '2天', status: '待开始' }
];

function dotClass(status) {
  if (status === 'red') return 'bg-red-500';
  if (status === 'yellow') return 'bg-yellow-400';
  if (status === 'green') return 'bg-green-500';
  return 'bg-slate-500';
}

function levelTextClass(level) {
  if (['红灯', 'red', 'bad', '异常'].includes(level)) return 'text-red-300';
  if (['黄灯', 'yellow', 'warn', '关注'].includes(level)) return 'text-yellow-300';
  return 'text-green-300';
}

function levelBorderClass(level) {
  if (['红灯', 'red', 'bad', '异常'].includes(level)) return 'border-red-500';
  if (['黄灯', 'yellow', 'warn', '关注'].includes(level)) return 'border-yellow-500';
  return 'border-green-500';
}

function taskClass(status) {
  if (status === '逾期') return 'bg-red-500/20 text-red-300 border border-red-500';
  if (status === '进行中') return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500';
  if (status === '待开始') return 'bg-slate-700 text-slate-300 border border-slate-600';
  return 'bg-green-500/20 text-green-300 border border-green-500';
}

function statusToLevel(status) {
  if (status === 'red' || status === 'bad' || status === '逾期') return '红灯';
  if (status === 'yellow' || status === 'warn' || status === '进行中') return '黄灯';
  return '绿灯';
}

export default function OCCDashboard() {
  const [currentPage, setCurrentPage] = useState('overview');
  const [selectedWorkshop, setSelectedWorkshop] = useState('OPP');
  const [selectedIssue, setSelectedIssue] = useState(null);

  const currentWorkshop = WORKSHOPS.find((item) => item.name === selectedWorkshop) || WORKSHOPS[0];

  const selfTests = useMemo(() => ({
    validDefaultPage: PAGES.includes('overview'),
    allKpiPagesKnown: KPI_CARDS.every((card) => PAGES.includes(card.page)),
    hasTopIssues: TOP_ISSUES.length === 3,
    hasTasks: TASKS.length === 3,
    hasInventory: INVENTORY_DATA.length === 4,
    hasWorkshopLines: WORKSHOPS.every((workshop) => workshop.lines.length === 3),
    canOpenIssueDetail: PAGES.includes('issueDetail')
  }), []);

  const openIssue = (issue) => {
    setSelectedIssue(issue);
    setCurrentPage('issueDetail');
  };

  const Header = () => (
    <div className="flex justify-between items-center mb-4 border-b border-cyan-900 pb-3">
      <div>
        <h1 className="text-3xl font-bold tracking-wide text-cyan-300">24-Hour Operations Intelligence Center</h1>
        <p className="text-slate-400 mt-1">Production Operation Command Center</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex gap-2 bg-[#0b1d33] border border-cyan-900 rounded-xl p-1">
          {[
            ['overview', '工厂总览'],
            ['workshop', '车间下钻'],
            ['inventory', '库存分析']
          ].map(([key, label]) => (
            <button key={key} onClick={() => setCurrentPage(key)} className={`px-4 py-2 rounded-lg text-sm transition ${currentPage === key ? 'bg-cyan-500 text-white' : 'text-slate-300 hover:bg-[#163559]'}`}>{label}</button>
          ))}
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold">2026-05-08</div>
          <div className="text-slate-400">08:30 晨会数据</div>
        </div>
      </div>
    </div>
  );

  const OverviewPage = () => (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-110px)]">
      <div className="col-span-3 flex flex-col gap-4 min-h-0">
        <div className="bg-[#0b1d33] rounded-2xl p-4 border border-cyan-900 flex-none">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-cyan-300">工厂健康度</h2>
            <div className="text-sm text-slate-400">昨日24H</div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {KPI_CARDS.map((item) => (
              <button key={item.title} onClick={() => setCurrentPage(item.page)} className={`bg-[#102845] rounded-xl p-2.5 hover:bg-[#163559] transition cursor-pointer text-left border ${levelBorderClass(item.status)}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-slate-300">{item.title}</div>
                    <div className={`text-2xl font-bold mt-1 ${levelTextClass(item.status)}`}>{item.value}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full ${dotClass(item.status)}`} />
                </div>
                <div className="mt-2 flex justify-between text-xs gap-2">
                  <span className="text-slate-400">目标：{item.target}</span>
                  <span className={levelTextClass(item.status)}>{item.delta}</span>
                </div>
                <div className="mt-1 text-xs text-cyan-300 truncate">{item.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#0b1d33] rounded-2xl p-4 border border-cyan-900 flex-1 min-h-0 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-cyan-300">晨会决策事项</h2>
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs">GM关注</span>
          </div>
          <div className="space-y-4">
            <button onClick={() => setCurrentPage('inventory')} className="w-full text-left bg-[#102845] p-4 rounded-xl border-l-4 border-red-500 hover:bg-[#163559] transition">
              <div className="font-semibold text-lg">是否启动库存消减计划</div>
              <div className="text-slate-400 mt-2 text-sm">成品库存连续5天超目标，需要确认是否调整生产节奏。</div>
            </button>
            <button onClick={() => setCurrentPage('quality')} className="w-full text-left bg-[#102845] p-4 rounded-xl border-l-4 border-yellow-500 hover:bg-[#163559] transition">
              <div className="font-semibold text-lg">STTG12质量异常升级</div>
              <div className="text-slate-400 mt-2 text-sm">降级吨数连续上升，需确认是否停机检查。</div>
            </button>
          </div>
        </div>
      </div>

      <div className="col-span-6 bg-[#0b1d33] rounded-2xl p-4 border border-cyan-900 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-cyan-300">过去24小时Top问题</h2>
            <div className="text-slate-400 text-sm mt-1">只展示红黄灯异常事件</div>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg border border-red-500 text-sm">红灯 1</span>
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg border border-yellow-500 text-sm">黄灯 2</span>
          </div>
        </div>
        <div className="space-y-4 overflow-auto h-[90%] pr-2">
          {TOP_ISSUES.map((issue) => (
            <button key={issue.title} onClick={() => openIssue(issue)} className="w-full text-left bg-[#102845] rounded-2xl p-5 hover:bg-[#173a60] transition cursor-pointer border border-slate-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs ${issue.level === '红灯' ? 'bg-red-500/20 text-red-300 border border-red-500' : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500'}`}>{issue.level}</span>
                    <span className="text-cyan-300 text-sm">{issue.dept}</span>
                  </div>
                  <div className="text-2xl font-semibold mb-3">{issue.title}</div>
                  <div className="text-slate-300 text-base">{issue.impact}</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 text-sm">责任人</div>
                  <div className="font-semibold mt-1">{issue.owner}</div>
                  <div className="mt-4 text-sm text-cyan-300">{issue.status}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="col-span-3 flex flex-col gap-4 min-h-0">
        <div className="bg-[#0b1d33] rounded-2xl p-4 border border-cyan-900 h-full overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-cyan-300">任务闭环追踪</h2>
              <div className="text-slate-400 text-sm mt-1">今日需跟进事项</div>
            </div>
            <button onClick={() => setCurrentPage('tasks')} className="bg-red-500/20 border border-red-500 text-red-300 px-3 py-1 rounded-lg text-sm hover:bg-red-500/30 transition">逾期 1</button>
          </div>
          <div className="space-y-4 pr-1">
            {TASKS.map((task) => (
              <button key={task.task} onClick={() => setCurrentPage('tasks')} className="w-full text-left bg-[#102845] rounded-xl p-4 border border-slate-700 hover:border-cyan-500 transition cursor-pointer">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <div className="text-lg font-semibold leading-6">{task.task}</div>
                    <div className="mt-3 text-sm text-slate-400">{task.dept} ｜ {task.owner}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${taskClass(task.status)}`}>{task.status}</span>
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-slate-400">剩余时间</span>
                  <span className="text-cyan-300">{task.due}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const InventoryPage = () => {
    const summaryCards = [
      { label: '库存超目标数量', value: '+950吨', sub: '较目标 +32%', status: 'bad' },
      { label: '周转天数', value: '77天', sub: '目标 ≤70天', status: 'warn' },
      { label: '呆滞库存数量', value: '260吨', sub: '90天以上未动', status: 'warn' },
      { label: '高风险SKU', value: '18个', sub: '需PPIC确认', status: 'warn' }
    ];

    const structure = [
      { name: '成品库存', percent: '46%', amount: '1800吨' },
      { name: '原材料库存', percent: '32%', amount: '10100吨' },
      { name: '再造粒库存', percent: '14%', amount: '350吨' },
      { name: '备件库存', percent: '8%', amount: '620件' }
    ];

    return (
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-110px)]">
        <div className="col-span-3 bg-[#0b1d33] rounded-2xl p-4 border border-cyan-900 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-cyan-300">库存总览</h2>
            <span className="bg-red-500/20 text-red-300 border border-red-500 px-3 py-1 rounded-full text-xs">红灯 2</span>
          </div>
          <div className="space-y-3">
            {INVENTORY_DATA.map((item) => (
              <button key={item.category} onClick={() => openIssue({ title: `${item.category}${item.diff}`, type: '库存异常', dept: item.owner, owner: item.owner, status: item.status === 'red' ? '异常' : item.status === 'yellow' ? '关注' : '正常', level: statusToLevel(item.status), occurTime: '昨日24H', impact: `${item.category}实际${item.actual}${item.unit}，目标${item.target}${item.unit}，偏差${item.diff}` })} className="w-full text-left bg-[#102845] rounded-xl p-4 border border-slate-700 hover:border-cyan-500 transition cursor-pointer">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">{item.category}</div>
                  <div className={`w-4 h-4 rounded-full ${dotClass(item.status)}`} />
                </div>
                <div className="mt-3 flex justify-between items-end">
                  <div>
                    <div className="text-sm text-slate-400">实际 / 目标</div>
                    <div className="text-2xl font-bold mt-1">{item.actual}{item.unit} / {item.target}{item.unit}</div>
                  </div>
                  <div className={`text-xl font-bold ${levelTextClass(item.status)}`}>{item.diff}</div>
                </div>
                <div className="mt-3 text-sm text-slate-400">责任：{item.owner}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-6 bg-[#0b1d33] rounded-2xl p-4 border border-cyan-900 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-cyan-300">库存分析看板</h2>
              <div className="text-slate-400 text-sm mt-1">用于晨会判断库存风险、责任归属与消减动作</div>
            </div>
            <button onClick={() => setCurrentPage('overview')} className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500 hover:bg-cyan-500/30 transition">返回总览</button>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {summaryCards.map((item) => (
              <button key={item.label} onClick={() => openIssue({ title: item.label, type: '库存异常', dept: 'PPIC', owner: '黄国华', status: item.status === 'bad' ? '异常' : '关注', level: statusToLevel(item.status), occurTime: '昨日24H', impact: `${item.label} 当前值 ${item.value}，${item.sub}` })} className={`bg-[#102845] rounded-xl p-4 border ${levelBorderClass(item.status)} text-left hover:scale-[1.01] transition`}>
                <div className="text-sm text-slate-400">{item.label}</div>
                <div className={`text-3xl font-bold mt-2 ${levelTextClass(item.status)}`}>{item.value}</div>
                <div className="text-xs text-slate-400 mt-2">{item.sub}</div>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 h-[calc(100%-155px)]">
            <div className="bg-[#102845] rounded-2xl p-4 border border-slate-700 overflow-auto">
              <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-semibold">库存结构</h3><span className="text-sm text-slate-400">按数量占比</span></div>
              <div className="space-y-5">
                {structure.map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between text-sm mb-2"><span>{item.name}</span><span className="text-cyan-300">{item.amount}</span></div>
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-cyan-400 rounded-full" style={{ width: item.percent }} /></div>
                    <div className="text-right text-xs text-slate-400 mt-1">{item.percent}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#102845] rounded-2xl p-4 border border-slate-700 overflow-auto">
              <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-semibold">库存风险原因</h3><span className="text-sm text-slate-400">晨会讨论重点</span></div>
              <div className="space-y-3">
                <div className="bg-[#0b1d33] rounded-xl p-4 border-l-4 border-red-500"><div className="font-semibold">成品库存偏高</div><div className="text-sm text-slate-400 mt-2">部分订单延期提货，生产计划未及时联动调整。</div></div>
                <div className="bg-[#0b1d33] rounded-xl p-4 border-l-4 border-yellow-500"><div className="font-semibold">再造粒库存偏高</div><div className="text-sm text-slate-400 mt-2">降级品消化节奏慢，返用计划未明确到产线。</div></div>
                <div className="bg-[#0b1d33] rounded-xl p-4 border-l-4 border-yellow-500"><div className="font-semibold">周转天数上升</div><div className="text-sm text-slate-400 mt-2">库存增长快于出货节奏，需关注未来7天消耗计划。</div></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3 bg-[#0b1d33] rounded-2xl p-4 border border-cyan-900 overflow-auto">
          <h2 className="text-xl font-semibold text-cyan-300 mb-4">库存消减行动</h2>
          <div className="bg-[#102845] rounded-xl p-4 border-l-4 border-red-500 mb-4">
            <div className="text-sm text-slate-400">晨会需决策</div>
            <div className="text-lg font-semibold mt-2">是否调整本周生产计划</div>
            <div className="text-sm text-slate-300 mt-3">成品库存已超目标80%，建议确认订单交付节奏和生产排程。</div>
          </div>
          <div className="space-y-3">
            {INVENTORY_TASKS.map((task) => (
              <div key={task.action} className="bg-[#102845] rounded-xl p-4 border border-slate-700">
                <div className="flex justify-between items-start gap-3">
                  <div><div className="font-semibold">{task.action}</div><div className="text-sm text-slate-400 mt-2">{task.owner} ｜ {task.due}</div></div>
                  <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${taskClass(task.status)}`}>{task.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const WorkshopPage = () => {
    const workshopKpis = [
      { label: '产量达成', value: currentWorkshop.output, target: '目标 ≥95%', delta: currentWorkshop.name === 'MET' ? '+3%' : currentWorkshop.name === 'OPP' ? '+1%' : '↓3%', status: currentWorkshop.name === 'MET' || currentWorkshop.name === 'OPP' ? 'green' : 'red' },
      { label: 'OEE', value: currentWorkshop.oee, target: '目标 ≥90%', delta: currentWorkshop.name === 'MET' ? '达标' : currentWorkshop.name === 'OPP' ? '↓2%' : '↓6%', status: currentWorkshop.name === 'MET' ? 'green' : currentWorkshop.name === 'OPP' ? 'yellow' : 'red' },
      { label: '首次合格率', value: currentWorkshop.quality, target: '目标 ≥98%', delta: currentWorkshop.name === 'MET' ? '+1.1%' : currentWorkshop.name === 'OPP' ? '+0.2%' : '↓0.4%', status: currentWorkshop.name === 'THE' ? 'yellow' : 'green' },
      { label: '准时交付', value: currentWorkshop.delivery, target: '目标 ≥95%', delta: currentWorkshop.name === 'MET' ? '+1%' : currentWorkshop.name === 'OPP' ? '↓1%' : '↓4%', status: currentWorkshop.name === 'MET' ? 'green' : currentWorkshop.name === 'OPP' ? 'yellow' : 'red' }
    ];

    return (
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-110px)]">
        <div className="col-span-3 bg-[#0b1d33] rounded-2xl p-4 border border-cyan-900 overflow-auto">
          <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold text-cyan-300">车间列表</h2><span className="text-sm text-slate-400">点击切换</span></div>
          <div className="space-y-3">
            {WORKSHOPS.map((workshop) => (
              <button key={workshop.name} onClick={() => setSelectedWorkshop(workshop.name)} className={`w-full text-left rounded-xl p-4 border transition ${selectedWorkshop === workshop.name ? 'bg-[#173a60] border-cyan-400' : 'bg-[#102845] border-slate-700 hover:bg-[#163559]'}`}>
                <div className="flex justify-between items-center"><div className="text-2xl font-bold">{workshop.name}</div><div className={`w-4 h-4 rounded-full ${dotClass(workshop.status)}`} /></div>
                <div className="mt-3 text-sm text-slate-400">Top问题</div>
                <div className="mt-1 text-sm text-cyan-300">{workshop.mainIssue}</div>
                <div className="mt-3 flex justify-between text-sm"><span>异常 {workshop.status === 'green' ? 0 : workshop.name === 'OPP' ? 2 : 1} 项</span><span>OEE {workshop.oee}</span></div>
              </button>
            ))}
          </div>
        </div>
        <div className="col-span-6 bg-[#0b1d33] rounded-2xl p-4 border border-cyan-900 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <div><h2 className="text-2xl font-semibold text-cyan-300">{currentWorkshop.name} 车间运营看板</h2><div className="text-slate-400 text-sm mt-1">昨日24小时车间状态下钻</div></div>
            <button onClick={() => setCurrentPage('overview')} className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500 hover:bg-cyan-500/30 transition">返回总览</button>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {workshopKpis.map((item) => (
              <button key={item.label} onClick={() => openIssue({ title: `${currentWorkshop.name} ${item.label} ${item.value}`, type: '车间指标异常', dept: currentWorkshop.name, owner: currentWorkshop.name === 'THE' ? '于玉乐' : currentWorkshop.name === 'OPP' ? '陈新均' : '王邦玉', status: item.status === 'red' ? '异常' : item.status === 'yellow' ? '关注' : '正常', level: statusToLevel(item.status), occurTime: '昨日24H', impact: `${item.label} 当前值 ${item.value}，${item.target}，偏差 ${item.delta}` })} className={`bg-[#102845] rounded-xl p-4 border ${levelBorderClass(item.status)} text-left hover:scale-[1.01] transition`}>
                <div className="flex justify-between items-start">
                  <div className="text-sm text-slate-400">{item.label}</div>
                  <div className={`w-3 h-3 rounded-full ${dotClass(item.status)}`} />
                </div>
                <div className={`text-3xl font-bold mt-2 ${levelTextClass(item.status)}`}>{item.value}</div>
                <div className={`text-sm mt-2 ${levelTextClass(item.status)}`}>{item.delta}</div>
                <div className="text-xs text-slate-400 mt-1">{item.target}</div>
              </button>
            ))}
          </div>
          <div className="bg-[#102845] rounded-2xl p-4 border border-slate-700 h-[calc(100%-155px)] overflow-auto">
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-semibold">产线状态</h3><span className="text-sm text-slate-400">按异常优先排序</span></div>
            <div className="space-y-3">
              {currentWorkshop.lines.map((line) => (
                <button key={line.name} onClick={() => openIssue({ title: `${line.name}：${line.status}`, type: '车间产线异常', dept: currentWorkshop.name, owner: currentWorkshop.name === 'THE' ? '于玉乐' : currentWorkshop.name === 'OPP' ? '陈新均' : '王邦玉', status: line.status, level: line.quality === '黄灯' ? '黄灯' : '绿灯', occurTime: '昨日24H', impact: `${line.name} OEE ${line.oee}，产量达成 ${line.output}，质量状态 ${line.quality}` })} className="w-full text-left grid grid-cols-12 items-center bg-[#0b1d33] rounded-xl p-4 border border-slate-700 hover:border-cyan-500 transition cursor-pointer">
                  <div className="col-span-3"><div className="text-xl font-semibold text-cyan-300">{line.name}</div><div className="text-sm text-slate-400 mt-1">{line.status}</div></div>
                  <div className="col-span-2"><div className="text-sm text-slate-400">OEE</div><div className="text-2xl font-bold">{line.oee}</div></div>
                  <div className="col-span-2"><div className="text-sm text-slate-400">产量</div><div className="text-2xl font-bold">{line.output}</div></div>
                  <div className="col-span-2"><div className="text-sm text-slate-400">质量</div><div className={line.quality === '黄灯' ? 'text-yellow-300' : 'text-green-300'}>{line.quality}</div></div>
                  <div className="col-span-3"><div className="h-2 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-cyan-400 rounded-full" style={{ width: line.oee }} /></div></div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-3 bg-[#0b1d33] rounded-2xl p-4 border border-cyan-900 overflow-auto">
          <h2 className="text-xl font-semibold text-cyan-300 mb-4">车间异常与行动</h2>
          <div className="bg-[#102845] rounded-xl p-4 border-l-4 border-yellow-500 mb-4"><div className="text-sm text-slate-400">当前Top问题</div><div className="text-lg font-semibold mt-2">{currentWorkshop.mainIssue}</div><div className="text-sm text-slate-300 mt-3">需在晨会确认责任人、完成时间和是否升级。</div></div>
          <div className="space-y-3">
            <div className="bg-[#102845] rounded-xl p-4 border border-slate-700"><div className="flex justify-between"><span className="text-slate-400">待处理任务</span><span className="text-yellow-300">2项</span></div><div className="mt-3 text-sm">根因确认、改善方案输出</div></div>
            <div className="bg-[#102845] rounded-xl p-4 border border-slate-700"><div className="flex justify-between"><span className="text-slate-400">需升级事项</span><span className="text-red-300">1项</span></div><div className="mt-3 text-sm">连续异常超过3天，建议GM关注</div></div>
            <div className="bg-[#102845] rounded-xl p-4 border border-slate-700"><div className="text-slate-400">今日跟进动作</div><ul className="mt-3 space-y-2 text-sm text-slate-300"><li>1. 确认异常根因</li><li>2. 输出临时措施</li><li>3. 明确关闭时间</li><li>4. 明日晨会更新状态</li></ul></div>
          </div>
        </div>
      </div>
    );
  };

  const SimpleDrillPage = ({ type }) => {
    const configs = {
      safety: {
        title: '安全下钻分析', subtitle: '事故、隐患、6S、整改闭环',
        cards: [
          { label: '昨日事故', value: '0', target: '目标 0', status: 'good' },
          { label: '未关闭隐患', value: '3', target: '今日需关闭 2', status: 'warn' },
          { label: '6S异常', value: '5', target: '较昨日 -1', status: 'warn' },
          { label: '整改及时率', value: '92%', target: '目标 ≥95%', status: 'bad' }
        ],
        items: [
          { title: 'B2区域消防通道占用，责任人：孟林', type: '安全隐患', dept: 'EHS', owner: '孟林', status: '处理中', level: '黄灯', occurTime: '昨日 09:30', impact: '影响消防通道可用性，需当天完成清理。' },
          { title: 'OPP现场地面油污，责任人：陈新均', type: '安全隐患', dept: 'OPP', owner: '陈新均', status: '处理中', level: '黄灯', occurTime: '昨日 11:10', impact: '存在滑倒风险，需确认清洁和防再发措施。' }
        ]
      },
      quality: {
        title: '质量下钻分析', subtitle: '降级、投诉、退货、一次合格率',
        cards: [
          { label: '首次合格率', value: '98.2%', target: '目标 ≥98%', status: 'good' },
          { label: '昨日降级', value: '2.5T', target: '目标 ≤1T', status: 'bad' },
          { label: '当日投诉', value: '1', target: '目标 0', status: 'bad' },
          { label: '退货数量', value: '0.55T', target: '月目标 ≤0.25%', status: 'bad' }
        ],
        items: [
          { title: 'STTG12油污降级2.5T，根因分析中', type: '质量异常', dept: 'OPP', owner: '刘丹', status: '根因分析中', level: '黄灯', occurTime: '昨日 14:20', impact: '降级数量2.5T，超过日目标1T。' },
          { title: 'SFP12S-D0212雾度指标异常，已关闭', type: '质量异常', dept: 'OPP', owner: '田进', status: '已关闭', level: '绿灯', occurTime: '昨日 10:10', impact: '连续三卷雾度指标异常，已完成批次隔离和工艺确认。' },
          { title: 'OPP气泡降级0.8T，需确认改善措施', type: '质量异常', dept: 'OPP', owner: '刘丹', status: '待确认', level: '黄灯', occurTime: '昨日 16:40', impact: '气泡缺陷导致降级0.8T。' }
        ]
      },
      efficiency: {
        title: '效率下钻分析', subtitle: 'OEE、产能利用率、速度损失、停机损失',
        cards: [
          { label: 'OEE', value: '88%', target: '目标 ≥90%', status: 'warn' },
          { label: '产能利用率', value: '75%', target: '目标 ≥85%', status: 'bad' },
          { label: '速度损失', value: '7%', target: 'TGL1206S偏低', status: 'bad' },
          { label: 'NPT', value: '1.5H', target: '较昨日 +0.5H', status: 'warn' }
        ],
        items: [
          { title: 'TGL1206S生产速度260m/min，目标280m/min', type: '效率异常', dept: 'THE', owner: '于玉乐', status: '待改善', level: '黄灯', occurTime: '昨日 13:00', impact: '速度低于目标7%，影响产量达成。' },
          { title: 'TGL1311S效率波动，需确认设备状态', type: '效率异常', dept: 'THE', owner: '于玉乐', status: '处理中', level: '黄灯', occurTime: '昨日 17:00', impact: 'OEE波动，需排查设备稳定性。' }
        ]
      },
      tasks: {
        title: '任务闭环下钻', subtitle: '逾期、阻塞、今日到期、已关闭任务',
        cards: [
          { label: '进行中', value: '8', target: '按计划推进', status: 'warn' },
          { label: '逾期', value: '1', target: '需升级', status: 'bad' },
          { label: '今日到期', value: '3', target: '晨会确认', status: 'warn' },
          { label: '已关闭', value: '12', target: '本周累计', status: 'good' }
        ],
        items: TASKS.map((item) => ({ title: `${item.dept}｜${item.task}｜${item.owner}｜${item.status}`, type: '任务闭环', dept: item.dept, owner: item.owner, status: item.status, level: statusToLevel(item.status), occurTime: '今日', impact: `任务剩余时间：${item.due}` }))
      }
    };

    const config = configs[type] || configs.efficiency;

    return (
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-110px)]">
        <div className="col-span-9 bg-[#0b1d33] rounded-2xl p-4 border border-cyan-900">
          <div className="flex justify-between items-center mb-4">
            <div><h2 className="text-2xl font-semibold text-cyan-300">{config.title}</h2><div className="text-slate-400 text-sm mt-1">{config.subtitle}</div></div>
            <button onClick={() => setCurrentPage('overview')} className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500 hover:bg-cyan-500/30 transition">返回总览</button>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {config.cards.map((item) => (
              <button key={item.label} onClick={() => openIssue({ title: item.label, type: config.title, dept: type.toUpperCase(), owner: '系统分析', status: item.status === 'bad' ? '异常' : item.status === 'warn' ? '关注' : '正常', level: statusToLevel(item.status), occurTime: '昨日24H', impact: `${item.label} 当前值 ${item.value}，目标 ${item.target}` })} className={`bg-[#102845] rounded-xl p-4 border ${levelBorderClass(item.status)} hover:scale-[1.01] transition cursor-pointer text-left`}>
                <div className="text-sm text-slate-400">{item.label}</div>
                <div className={`text-3xl font-bold mt-2 ${levelTextClass(item.status)}`}>{item.value}</div>
                <div className="text-xs text-cyan-300 mt-2">{item.target}</div>
              </button>
            ))}
          </div>
          <div className="bg-[#102845] rounded-2xl p-4 border border-slate-700 h-[calc(100%-150px)] overflow-auto">
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-semibold">异常明细与处理状态</h3><span className="text-sm text-slate-400">点击事项可继续扩展到事件详情</span></div>
            <div className="space-y-3">
              {config.items.map((item) => (
                <button key={item.title} onClick={() => openIssue(item)} className="w-full text-left bg-[#0b1d33] rounded-xl p-4 border border-slate-700 hover:border-cyan-500 transition cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div><div className="text-lg">{item.title}</div><div className="text-sm text-slate-400 mt-1">{item.dept} ｜ {item.owner} ｜ {item.status}</div></div>
                    <span className="text-cyan-300 text-sm">查看详情</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-3 bg-[#0b1d33] rounded-2xl p-4 border border-cyan-900">
          <h2 className="text-xl font-semibold text-cyan-300 mb-4">晨会处理建议</h2>
          <div className="space-y-3">
            <div className="bg-[#102845] rounded-xl p-4 border-l-4 border-yellow-500"><div className="font-semibold">先看红黄灯</div><div className="text-sm text-slate-400 mt-2">正常指标不展开，只确认异常和趋势。</div></div>
            <div className="bg-[#102845] rounded-xl p-4 border-l-4 border-cyan-500"><div className="font-semibold">确认责任与时间</div><div className="text-sm text-slate-400 mt-2">每个问题必须明确负责人、完成时间和明日更新方式。</div></div>
            <div className="bg-[#102845] rounded-xl p-4 border-l-4 border-red-500"><div className="font-semibold">需要升级的事项</div><div className="text-sm text-slate-400 mt-2">连续异常、逾期、跨部门卡点进入GM关注。</div></div>
          </div>
        </div>
      </div>
    );
  };

  const IssueDetailPage = () => {
    const issue = selectedIssue || TOP_ISSUES[0];
    const level = issue.level || '黄灯';
    const levelText = levelTextClass(level);
    const levelBorder = levelBorderClass(level);

    return (
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-110px)]">
        <div className="col-span-8 bg-[#0b1d33] rounded-2xl p-5 border border-cyan-900 overflow-auto">
          <div className="flex justify-between items-start mb-5">
            <div>
              <div className="text-sm text-cyan-300 mb-2">{issue.type || '异常事件'} ｜ {issue.dept}</div>
              <h2 className="text-3xl font-bold">{issue.title}</h2>
              <div className="text-slate-400 mt-2">发生时间：{issue.occurTime || '昨日24H'}</div>
            </div>
            <button onClick={() => setCurrentPage('overview')} className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500 hover:bg-cyan-500/30 transition">返回总览</button>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-5">
            <div className={`bg-[#102845] rounded-xl p-4 border ${levelBorder}`}><div className={`text-sm ${levelText}`}>异常等级</div><div className={`text-2xl font-bold mt-2 ${levelText}`}>{level}</div></div>
            <div className="bg-[#102845] rounded-xl p-4 border border-slate-700"><div className="text-sm text-slate-400">责任人</div><div className="text-2xl font-bold mt-2">{issue.owner || '系统分析'}</div></div>
            <div className={`bg-[#102845] rounded-xl p-4 border ${levelBorder}`}><div className={`text-sm ${levelText}`}>当前状态</div><div className={`text-2xl font-bold mt-2 ${levelText}`}>{issue.status || '处理中'}</div></div>
            <div className="bg-[#102845] rounded-xl p-4 border border-slate-700"><div className="text-sm text-slate-400">预计关闭</div><div className="text-2xl font-bold mt-2">明日</div></div>
          </div>
          <div className="bg-[#102845] rounded-2xl p-5 border border-slate-700 mb-5"><h3 className="text-xl font-semibold text-cyan-300 mb-3">问题影响</h3><div className="text-slate-300 leading-7">{issue.impact || '该问题需要在晨会上明确责任人与关闭时间。'}</div></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#102845] rounded-2xl p-5 border border-slate-700"><h3 className="text-xl font-semibold text-cyan-300 mb-4">5W2H问题描述</h3><div className="space-y-3 text-sm"><div><span className="text-slate-400">What：</span>{issue.title}</div><div><span className="text-slate-400">Where：</span>{issue.dept}</div><div><span className="text-slate-400">When：</span>{issue.occurTime || '昨日24H'}</div><div><span className="text-slate-400">Who：</span>{issue.owner || '系统分析'}</div><div><span className="text-slate-400">How much：</span>{issue.impact || '待确认'}</div></div></div>
            <div className="bg-[#102845] rounded-2xl p-5 border border-slate-700"><h3 className="text-xl font-semibold text-cyan-300 mb-4">处理进展</h3><div className="space-y-3 text-sm"><div className="border-l-4 border-cyan-500 pl-3">已确认异常事件和影响范围</div><div className="border-l-4 border-yellow-500 pl-3">正在确认根因与责任人</div><div className="border-l-4 border-slate-500 pl-3">待输出纠正措施</div><div className="border-l-4 border-slate-500 pl-3">明日晨会更新关闭状态</div></div></div>
          </div>
        </div>
        <div className="col-span-4 bg-[#0b1d33] rounded-2xl p-5 border border-cyan-900 overflow-auto">
          <h3 className="text-xl font-semibold text-cyan-300 mb-4">关联任务</h3>
          <div className="space-y-3">{['确认根因', '输出临时措施', '验证改善效果'].map((task, index) => (<div key={task} className={`bg-[#102845] rounded-xl p-4 border ${index === 0 ? levelBorder : 'border-slate-700'}`}><div className="font-semibold">{task}</div><div className="text-sm text-slate-400 mt-2">{issue.owner || '系统分析'} ｜ {index === 0 ? '今日' : `${index + 1}天`} ｜ {index === 0 ? '进行中' : '待开始'}</div></div>))}</div>
          <h3 className="text-xl font-semibold text-cyan-300 mt-6 mb-4">晨会需要确认</h3>
          <div className="space-y-3"><div className="bg-[#102845] rounded-xl p-4 border-l-4 border-red-500">是否需要升级GM关注？</div><div className="bg-[#102845] rounded-xl p-4 border-l-4 border-yellow-500">责任人和关闭时间是否明确？</div><div className="bg-[#102845] rounded-xl p-4 border-l-4 border-cyan-500">明日晨会是否可关闭？</div></div>
        </div>
      </div>
    );
  };

  const renderCurrentPage = () => {
    if (currentPage === 'workshop') return <WorkshopPage />;
    if (currentPage === 'inventory') return <InventoryPage />;
    if (currentPage === 'issueDetail') return <IssueDetailPage />;
    if (['safety', 'quality', 'efficiency', 'tasks'].includes(currentPage)) return <SimpleDrillPage type={currentPage} />;
    return <OverviewPage />;
  };

  return (
    <div className="w-full h-screen bg-[#06111f] text-white p-4 overflow-hidden">
      <Header />
      {renderCurrentPage()}
      <div className="hidden" data-testid="self-tests">{JSON.stringify(selfTests)}</div>
    </div>
  );
}
