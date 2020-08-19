<template>
  <li class="broadcast-item">{{content}}</li>
</template>
<style lang="scss">
  .broadcast-item {
    color: #FFFFFF;
    text-shadow: black 0.1em 0.1em 0.2em;
    min-height: 120px;
    width: 100%;
    /* background-color: yellow; */
    line-height: 2rem;
    text-align: justify;
    padding-bottom: 100px;
    text-indent: 2rem;
    font-size: 1rem;
  }

</style>
<script type="text/javascript">
  export default {
    props: {
      content: {
        default: 0
      }
    }
  }

</script>
