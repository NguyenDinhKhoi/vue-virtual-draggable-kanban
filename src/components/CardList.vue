<template>
  <!-- <draggable :options="{ group: 'cards' }" group="cards" ghostClass="ghost"> -->
  <!-- <draggable-virtual-list
    class="phrase-list"
    v-model="items"
    :size="50"
    :keeps="20"
    :data-key="'id'"
    :data-sources="items"
    >
  </draggable-virtual-list> -->
  <virtual-scroll :items="cards" v-slot="{item}">
    <span class="element-card" @click="togglePopup(item)">
      {{ item.name }}
    </span>
  </virtual-scroll>
  <!-- </draggable> -->
</template>

<script>
// import { VueDraggableNext } from "vue-draggable-next";
import VirtualScroll from "@/components/VirtualScroll";
// import DraggableVirtualList from 'vue-draggable-virtual-scroll-list';
export default {
  props: ["listId", "listName"],
  components: {
    // draggable: VueDraggableNext,
    // DraggableVirtualList,
    VirtualScroll,
  },
  data() {
    return {
      cardsData: this.$store.getters["cards"],
      cardFilteredByListId: this.$store.getters["cards"],
    };
  },
  methods: {
    togglePopup(data) {
      console.dir(data);
      const currentData = {
        listId: this.listId,
        listName: this.listName,
        id: data.id,
        name: data.name,
      };
      this.$store.dispatch("toggleOverlay");
      this.$store.dispatch("openForm", currentData);
    }
  },
  computed: {
    cards() {
      return this.cardFilteredByListId.filter((card) => {
        if (card.listId === this.listId) {
          return true;
        } else {
          return false;
        }
      });
    },
    overlayIsActive() {
      return this.$store.getters["overlay"];
    },
  }
};
</script>

<style>
.element-card {
  position: relative;
  background-color: white;
  height: auto;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  min-height: 30px;
  margin-bottom: 10px;
  word-break: break-all;
  text-align: left;
}
</style>
