<template>
    <div class="faqs">
        <div class="faq" v-for="faq in faqs" :key="faq.question">
            <div>Q: {{faq.question}}</div>
            <div>A: {{faq.answer}}</div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Help',
  data: () => ({
    faqs: [{
      question: 'Why there is no unit price displayed?',
      answer: 'KBY is based on DAIBO protocol which provides a group purchase model, the unit price will be confirmed only the time up.',
    }],
  }),
};
</script>

