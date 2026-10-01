<script setup lang="ts">
import { computed, ref } from 'vue'
import { elementOf, koreanGan, koreanZhi, makeChart } from './lib/manseryeok'
import type { Chart, Element } from './lib/manseryeok'

const birthDate = ref('1999-01-01')
const birthTime = ref('00:00')
const gender = ref<'male' | 'female'>('female')
const submitted = ref({ date: birthDate.value, time: birthTime.value, gender: gender.value })
const error = ref('')
const chart = ref<Chart>(makeChart(birthDate.value, birthTime.value, gender.value))
const dateLabel = computed(() => {
  const [year, month, day] = submitted.value.date.split('-')
  return `${year}년 ${Number(month)}월 ${Number(day)}일 ${submitted.value.time}`
})
const elementOrder: Element[] = ['목', '화', '토', '금', '수']

function showChart() {
  error.value = ''
  const [year, month, day] = birthDate.value.split('-').map(Number)
  const selected = new Date(year!, month! - 1, day!)
  if (
    !birthDate.value ||
    selected.getFullYear() !== year ||
    selected.getMonth() + 1 !== month ||
    selected.getDate() !== day
  ) {
    error.value = '올바른 생년월일을 입력해 주세요.'
    return
  }
  if (!birthTime.value) {
    error.value = '태어난 시간을 입력해 주세요.'
    return
  }
  try {
    // 입력값이 확정되면 절기 기준 만세력 계산을 다시 수행하고 결과를 갱신한다.
    chart.value = makeChart(birthDate.value, birthTime.value, gender.value)
    submitted.value = { date: birthDate.value, time: birthTime.value, gender: gender.value }
    document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } catch {
    error.value = '이 날짜는 계산 범위를 벗어났습니다. 다른 날짜를 입력해 주세요.'
  }
}
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <div class="brand">
        <span class="brand-mark">萬</span><span>만세력<span class="brand-dot">.</span></span>
      </div>
    </header>
    <main>
      <section class="form-card" aria-labelledby="form-title">
        <div class="section-heading">
          <div>
            <span class="section-kicker" hidden>BIRTH INFORMATION</span>
            <h2 id="form-title">출생 정보 입력</h2>
          </div>
        </div>
        <form @submit.prevent="showChart">
          <div class="form-grid">
            <label class="field"
              ><span>생년월일 <b>*</b></span
              ><input v-model="birthDate" type="date" min="1900-01-01" max="2100-12-31" required
            /></label>
            <label class="field"
              ><span>태어난 시간 <b>*</b></span
              ><input v-model="birthTime" type="time" required
            /></label>
            <fieldset class="field gender-field">
              <legend>성별 <b>*</b></legend>
              <div class="segmented">
                <label :class="{ active: gender === 'female' }"
                  ><input v-model="gender" type="radio" value="female" />여성</label
                ><label :class="{ active: gender === 'male' }"
                  ><input v-model="gender" type="radio" value="male" />남성</label
                >
              </div>
            </fieldset>
          </div>
          <div class="form-footer">
            <p>현재 양력 기준 · 한국 표준시 출생 시각으로 계산합니다.</p>
            <button class="submit-button" type="submit">
              만세력 보기 <span aria-hidden="true">↗</span>
            </button>
          </div>
          <p v-if="error" class="error" role="alert">{{ error }}</p>
        </form>
      </section>

      <section id="result" class="result-section" aria-labelledby="result-title">
        <div class="result-top">
          <div>
            <span class="section-kicker" hidden>YOUR SAJU CHART</span>
            <h2 id="result-title">나의 만세력</h2>
            <p>{{ dateLabel }} · 양력</p>
          </div>
          <span class="result-seal">四柱<br />命式</span>
        </div>
        <div class="chart-card">
          <div class="chart-grid">
            <article
              v-for="pillar in chart.pillars"
              :key="pillar.key"
              class="pillar"
              :class="{ 'day-pillar': pillar.key === 'day' }"
            >
              <div class="pillar-heading">
                <span class="pillar-title">{{ pillar.title }}</span
                ><span class="pillar-sub">{{
                  pillar.key === 'time'
                    ? 'TIME'
                    : pillar.key === 'day'
                      ? 'DAY'
                      : pillar.key === 'month'
                        ? 'MONTH'
                        : 'YEAR'
                }}</span>
              </div>
              <div class="pillar-body">
                <p class="ten-god" :class="{ highlight: pillar.key === 'day' }">
                  {{ pillar.stemTenGod }}
                </p>
                <div class="hanja-tile" :class="`element-${elementOf(pillar.gan)}`">
                  <span>{{ pillar.gan }}</span
                  ><small>{{ koreanGan(pillar.gan) }}</small>
                </div>
                <div class="hanja-tile" :class="`element-${elementOf(pillar.zhi)}`">
                  <span>{{ pillar.zhi }}</span
                  ><small>{{ koreanZhi(pillar.zhi) }}</small>
                </div>
                <p class="ten-god bottom-god">{{ pillar.branchTenGods[0] || '—' }}</p>
              </div>
              <div class="pillar-detail">
                <span class="detail-label">지장간</span
                ><strong>{{ pillar.hiddenStems.join(' · ') }}</strong>
              </div>
              <div class="pillar-detail">
                <span class="detail-label">십이운성</span><strong>{{ pillar.stage }}</strong>
              </div>
              <div class="pillar-detail">
                <span class="detail-label">납음</span><strong>{{ pillar.naYin }}</strong>
              </div>
              <div class="pillar-detail">
                <span class="detail-label">공망</span><strong>{{ pillar.empty || '—' }}</strong>
              </div>
            </article>
          </div>
        </div>
        <div class="lower-grid">
          <div class="info-card elements-card">
            <div class="mini-heading">
              <div>
                <span class="section-kicker" hidden>FIVE ELEMENTS</span>
                <h3>오행 분포</h3>
              </div>
            </div>
            <p class="card-description">사주 여덟 글자에 나타난 오행의 균형입니다.</p>
            <div class="element-list">
              <div v-for="element in elementOrder" :key="element" class="element-row">
                <span class="element-name" :class="`element-${element}`">{{ element }}</span>
                <div class="meter">
                  <span
                    :class="`bar-${element}`"
                    :style="{ width: `${chart.elements[element] * 25}%` }"
                  ></span>
                </div>
                <strong>{{ chart.elements[element] }}</strong>
              </div>
            </div>
            <p class="card-footnote">천간과 지지의 본기를 기준으로 집계</p>
          </div>
          <div class="info-card fortune-card">
            <div class="mini-heading">
              <div>
                <span class="section-kicker" hidden>DECADE FORTUNE</span>
                <h3>대운의 흐름</h3>
              </div>
            </div>
            <p class="card-description">
              {{ chart.startAge }}세부터 시작 · {{ chart.direction }} ·
              {{ submitted.gender === 'female' ? '여성' : '남성' }} 기준
            </p>
            <div class="fortune-scroll">
              <div v-for="fortune in chart.fortunes" :key="fortune.age" class="fortune-item">
                <span class="fortune-age">{{ fortune.age }}세</span
                ><span class="fortune-gan" :class="`text-${elementOf(fortune.gan)}`">{{
                  fortune.gan
                }}</span
                ><span class="fortune-zhi" :class="`text-${elementOf(fortune.zhi)}`">{{
                  fortune.zhi
                }}</span
                ><small>{{ koreanGan(fortune.gan) }}{{ koreanZhi(fortune.zhi) }}</small>
              </div>
            </div>
            <p class="card-footnote">대운은 10년 단위로 바뀌는 운의 흐름입니다.</p>
          </div>
        </div>
        <p class="result-note">
          ※ 절기 기준으로 계산한 참고용 만세력입니다. 출생지 진태양시, 야자시 등 유파별 기준에 따라
          결과가 달라질 수 있습니다.
        </p>
      </section>
    </main>
  </div>
</template>
