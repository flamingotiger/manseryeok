# 만세력

<img width="477" height="759" alt="스크린샷 2026-10-01 오후 4 17 40" src="https://github.com/user-attachments/assets/31c0229a-1323-4e84-b69d-a7fd92c09694" />


Vue 3로 만든 생년월일 기반 만세력 페이지입니다. 양력 생년월일, 출생 시간, 성별을 입력하면 사주 네 기둥과 오행 분포, 대운을 보여줍니다.

## 실행

```sh
pnpm install
pnpm dev
```

프로덕션 빌드와 타입 검사는 `pnpm build`로 실행합니다.

## 계산 코드

- 화면과 입력 처리: `src/App.vue`
- 만세력 계산과 한글 표기: `src/lib/manseryeok.ts`
- 절기 기준 사주와 대운 계산: `lunar-typescript`

계산이 이루어지는 부분마다 한국어 주석을 넣었습니다. 현재 양력과 한국 표준시의 출생 시각을 입력받습니다. 출생지 진태양시 보정과 유파별 야자시 규칙은 적용하지 않습니다.
