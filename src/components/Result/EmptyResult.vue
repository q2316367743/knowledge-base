<template>
  <div class="empty-result-container">
    <div class="empty-result-bg-img">
      <svg width="200" height="140" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g mask="url(#mask0_16559_24301)">
          <path d="M30 62H118V122H30V62Z" fill="#97A3B7"/>
          <g filter="url(#filter0_f_16559_24301)">
            <rect x="12" y="84" width="80" height="60" fill="#E3E6EB"/>
          </g>
          <g filter="url(#filter1_f_16559_24301)">
            <rect x="80" y="54" width="80" height="60" fill="#E3E6EB"/>
          </g>
          <path d="M49 93L42 100L49 107" stroke="white" stroke-width="2"/>
          <path d="M69 107L76 100L69 93" stroke="white" stroke-width="2"/>
          <path d="M62.3647 87.4431L55.6355 112.557" stroke="white" stroke-width="2"/>
        </g>
        <path opacity="0.9" d="M63 20H151V30H63V20Z" fill="currentcolor"/>
        <mask id="mask1_16559_24301" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="63" y="30" width="88"
              height="50">
          <path d="M63 30H151V80H63V30Z" fill="currentcolor"/>
        </mask>
        <g mask="url(#mask1_16559_24301)">
          <path d="M63 30H151V80H63V30Z" fill="currentcolor"/>
          <g opacity="0.3" filter="url(#filter2_f_16559_24301)">
            <path d="M30 62H118V122H30V62Z" fill="#97A3B7"/>
          </g>
        </g>
        <path fill-rule="evenodd" clip-rule="evenodd"
              d="M105.25 41C112.015 41 117.5 46.4845 117.5 53.25C117.5 55.6827 116.791 57.9498 115.568 59.8558L121 65.2877L117.288 69L111.856 63.5681C109.95 64.7909 107.683 65.5 105.25 65.5C98.4845 65.5 93 60.0155 93 53.25C93 46.4845 98.4845 41 105.25 41ZM105.25 44.5C100.418 44.5 96.5 48.4175 96.5 53.25C96.5 58.0825 100.418 62 105.25 62C110.082 62 114 58.0825 114 53.25C114 48.4175 110.082 44.5 105.25 44.5Z"
              fill="white"/>
        <rect x="68" y="24" width="2" height="2" fill="white"/>
        <rect x="74" y="24" width="2" height="2" fill="white"/>
        <rect x="80" y="24" width="66" height="2" fill="white"/>
        <path fill-rule="evenodd" clip-rule="evenodd"
              d="M153 56C140.85 56 131 65.8497 131 78C131 82.6039 132.414 86.8776 134.832 90.4102L127 98.5L139.495 95.3681C143.222 98.2709 147.909 100 153 100C165.15 100 175 90.1503 175 78C175 65.8497 165.15 56 153 56Z"
              fill="white"/>
        <path
          d="M131 78L131.5 78V78L131 78ZM134.832 90.4102L135.191 90.758L135.475 90.4647L135.245 90.1278L134.832 90.4102ZM127 98.5L126.641 98.1522L125.422 99.411L127.122 98.985L127 98.5ZM139.495 95.3681L139.802 94.9736L139.61 94.8238L139.373 94.8831L139.495 95.3681ZM153 100L153 100.5L153 100.5L153 100ZM175 78L174.5 78L174.5 78L175 78ZM131.5 78C131.5 66.1259 141.126 56.5 153 56.5V55.5C140.574 55.5 130.5 65.5736 130.5 78L131.5 78ZM135.245 90.1278C132.882 86.6757 131.5 82.5 131.5 78H130.5C130.5 82.7079 131.946 87.0794 134.419 90.6926L135.245 90.1278ZM134.473 90.0624L126.641 98.1522L127.359 98.8478L135.191 90.758L134.473 90.0624ZM127.122 98.985L139.616 95.8531L139.373 94.8831L126.878 98.015L127.122 98.985ZM153 99.5C148.024 99.5 143.445 97.8105 139.802 94.9736L139.187 95.7626C143 98.7314 147.794 100.5 153 100.5V99.5ZM174.5 78C174.5 89.8741 164.874 99.5 153 99.5L153 100.5C165.426 100.5 175.5 90.4264 175.5 78L174.5 78ZM153 56.5C164.874 56.5 174.5 66.1259 174.5 78H175.5C175.5 65.5736 165.426 55.5 153 55.5V56.5Z"
          fill="black"/>
      </svg>
    </div>
    <div class="empty-result-title">{{ title }}</div>
    <div class="empty-result-tip">{{ tip }}</div>
    <div class="empty-result-default">
      <slot/>
    </div>
  </div>
</template>
<script lang="ts">
export default defineComponent({
  name: 'EmptyResult',
  props: {
    title: String,
    tip: String,
  }
})
</script>
<style lang="less" scoped>
.empty-result {

  &-container {
    min-height: 400px;
    height: 85vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &-bg-img {
    width: 200px;
    color: var(--td-brand-color);
  }

  &-title {
    font: var(--td-font-title-large);
    font-style: normal;
    margin-top: var(--td-comp-margin-l);
    color: var(--td-text-color-primary);
    user-select: none;
  }

  &-tip {
    margin: var(--td-comp-margin-s) 0 0 0;
    font: var(--td-font-body-medium);
    color: var(--td-text-color-secondary);
    user-select: none;

  }

  &-default {
    margin-top: var(--td-comp-margin-xxxl);
  }
}
</style>