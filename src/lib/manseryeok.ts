import { Solar } from 'lunar-typescript'

export type Element = '목' | '화' | '토' | '금' | '수'
export type Pillar = {
  key: string
  title: string
  gan: string
  zhi: string
  stemTenGod: string
  branchTenGods: string[]
  hiddenStems: string[]
  stage: string
  naYin: string
  empty: string
}

export type Fortune = { age: number; gan: string; zhi: string }
export type Chart = {
  pillars: Pillar[]
  elements: Record<Element, number>
  fortunes: Fortune[]
  startAge: number
  direction: string
}

const GAN = '甲乙丙丁戊己庚辛壬癸'
const ZHI = '子丑寅卯辰巳午未申酉戌亥'
const GAN_KO = '갑을병정무기경신임계'
const ZHI_KO = '자축인묘진사오미신유술해'
const GAN_ELEMENTS: Element[] = ['목', '목', '화', '화', '토', '토', '금', '금', '수', '수']
const ZHI_ELEMENTS: Element[] = [
  '수',
  '토',
  '목',
  '목',
  '토',
  '화',
  '화',
  '토',
  '금',
  '금',
  '토',
  '수',
]
const TEN_GODS: Record<string, string> = {
  比肩: '비견',
  劫财: '겁재',
  劫財: '겁재',
  食神: '식신',
  伤官: '상관',
  傷官: '상관',
  偏财: '편재',
  偏財: '편재',
  正财: '정재',
  正財: '정재',
  七杀: '편관',
  七殺: '편관',
  偏官: '편관',
  正官: '정관',
  偏印: '편인',
  正印: '정인',
  日主: '일간 (나)',
}
const STAGES: Record<string, string> = {
  长生: '장생',
  長生: '장생',
  沐浴: '목욕',
  冠带: '관대',
  冠帶: '관대',
  临官: '건록',
  臨官: '건록',
  帝旺: '제왕',
  衰: '쇠',
  病: '병',
  死: '사',
  墓: '묘',
  绝: '절',
  絶: '절',
  胎: '태',
  养: '양',
  養: '양',
}
const NA_YIN: Record<string, string> = {
  海中金: '해중금',
  炉中火: '노중화',
  爐中火: '노중화',
  大林木: '대림목',
  路旁土: '노방토',
  剑锋金: '검봉금',
  劍鋒金: '검봉금',
  山头火: '산두화',
  山頭火: '산두화',
  涧下水: '간하수',
  澗下水: '간하수',
  城头土: '성두토',
  城頭土: '성두토',
  白蜡金: '백랍금',
  白蠟金: '백랍금',
  杨柳木: '양류목',
  楊柳木: '양류목',
  泉中水: '천중수',
  屋上土: '옥상토',
  霹雳火: '벽력화',
  霹靂火: '벽력화',
  松柏木: '송백목',
  长流水: '장류수',
  長流水: '장류수',
  沙中金: '사중금',
  山下火: '산하화',
  平地木: '평지목',
  壁上土: '벽상토',
  金箔金: '금박금',
  覆灯火: '복등화',
  覆燈火: '복등화',
  天河水: '천하수',
  大驿土: '대역토',
  大驛土: '대역토',
  钗钏金: '차천금',
  釵釧金: '차천금',
  桑柘木: '상자목',
  大溪水: '대계수',
  沙中土: '사중토',
  天上火: '천상화',
  石榴木: '석류목',
  大海水: '대해수',
}

export function koreanGan(char: string) {
  return GAN_KO[GAN.indexOf(char)] ?? char
}

export function koreanZhi(char: string) {
  return ZHI_KO[ZHI.indexOf(char)] ?? char
}

export function elementOf(char: string): Element {
  const ganIndex = GAN.indexOf(char)
  if (ganIndex >= 0) return GAN_ELEMENTS[ganIndex]!
  return ZHI_ELEMENTS[ZHI.indexOf(char)] ?? '토'
}

function koreanTerm(value: string) {
  return TEN_GODS[value] ?? STAGES[value] ?? value
}

export function makeChart(date: string, time: string, gender: 'male' | 'female'): Chart {
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)

  // 입력한 양력 날짜와 현지 출생 시각을 음력/절기 기반 사주 계산 객체로 변환한다.
  // 지역별 진태양시 보정이나 23시 일주 변경 규칙이 필요하면 이 지점에서 적용한다.
  const solar = Solar.fromYmdHms(year!, month!, day!, hour!, minute!, 0)
  const eight = solar.getLunar().getEightChar()

  // 절기 기준 년주와 월주, 일주, 시주를 이미지와 같은 시·일·월·년 순서로 배열한다.
  const pillars: Pillar[] = [
    {
      key: 'time',
      title: '시주',
      gan: eight.getTimeGan(),
      zhi: eight.getTimeZhi(),
      stemTenGod: eight.getTimeShiShenGan(),
      branchTenGods: eight.getTimeShiShenZhi(),
      hiddenStems: eight.getTimeHideGan(),
      stage: eight.getTimeDiShi(),
      naYin: eight.getTimeNaYin(),
      empty: eight.getTimeXunKong(),
    },
    {
      key: 'day',
      title: '일주',
      gan: eight.getDayGan(),
      zhi: eight.getDayZhi(),
      stemTenGod: eight.getDayShiShenGan(),
      branchTenGods: eight.getDayShiShenZhi(),
      hiddenStems: eight.getDayHideGan(),
      stage: eight.getDayDiShi(),
      naYin: eight.getDayNaYin(),
      empty: eight.getDayXunKong(),
    },
    {
      key: 'month',
      title: '월주',
      gan: eight.getMonthGan(),
      zhi: eight.getMonthZhi(),
      stemTenGod: eight.getMonthShiShenGan(),
      branchTenGods: eight.getMonthShiShenZhi(),
      hiddenStems: eight.getMonthHideGan(),
      stage: eight.getMonthDiShi(),
      naYin: eight.getMonthNaYin(),
      empty: eight.getMonthXunKong(),
    },
    {
      key: 'year',
      title: '년주',
      gan: eight.getYearGan(),
      zhi: eight.getYearZhi(),
      stemTenGod: eight.getYearShiShenGan(),
      branchTenGods: eight.getYearShiShenZhi(),
      hiddenStems: eight.getYearHideGan(),
      stage: eight.getYearDiShi(),
      naYin: eight.getYearNaYin(),
      empty: eight.getYearXunKong(),
    },
  ]
  pillars.forEach((pillar) => {
    pillar.stemTenGod = koreanTerm(pillar.stemTenGod)
    pillar.branchTenGods = pillar.branchTenGods.map(koreanTerm)
    pillar.stage = koreanTerm(pillar.stage)
    pillar.naYin = NA_YIN[pillar.naYin] ?? pillar.naYin
  })

  // 오행 수는 천간 네 글자와 지지 네 글자의 본기만 한 번씩 센다.
  const elements: Record<Element, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 }
  pillars.forEach(({ gan, zhi }) => {
    elements[elementOf(gan)]++
    elements[elementOf(zhi)]++
  })

  // 대운 방향과 시작 나이는 성별 및 년간의 음양에 따라 계산된다.
  const yun = eight.getYun(gender === 'male' ? 1 : 0)
  const fortunes = yun
    .getDaYun(9)
    .filter((item) => item.getGanZhi().length === 2)
    .slice(0, 8)
    .map((item) => ({
      age: item.getStartAge(),
      gan: item.getGanZhi()[0]!,
      zhi: item.getGanZhi()[1]!,
    }))

  return {
    pillars,
    elements,
    fortunes,
    startAge: fortunes[0]?.age ?? 0,
    direction: yun.isForward() ? '순행' : '역행',
  }
}
