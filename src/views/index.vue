<template>
  <div id="app">
    <h1>Test Index Page</h1>
    <p>Hello world!</p>

    <!-- Import the components -->
    <Test />

    <span>Chart Begin</span>
    <!-- Test chart -->
    <BarChart />
  </div>
</template>

<script>
import Test from '../components/test.vue';
import BarChart from '../components/chart.vue';

export default {
  components: {
    Test, // Register 'Test' component
    BarChart
  }
};
</script>

<style scoped>
@import '../assets/static/css/scrollbar.css';

#app {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: aquamarine;
}

h1 {
  text-align: center;
}

p {
  text-align: center;
}
</style>
