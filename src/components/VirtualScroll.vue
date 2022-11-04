<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="root" ref="root" :style="rootStyle">
    <div class="viewport" ref="viewport" :style="viewportStyle">
      <!-- <div class="spacer" ref="spacer" :style="spacerStyle">
          <slot v-for="(item, index) in visibleItems" :item="item" :key="index"></slot>
      </div> -->
      <VueDraggableNext v-model="items" class="spacer" ref="spacer" :style="spacerStyle" :options="{ group: 'cards' }"
        group="cards" ghostClass="ghost" v-bind="dragOptions" @end="handleEndDrag(items)" style="min-height:400px">
        <slot v-for="(item, index) in visibleItems" :item="item" :key="index"></slot>
      </VueDraggableNext>
    </div>
  </div>
</template>
<script>
import { VueDraggableNext } from "vue-draggable-next";
import passiveSupportMixin from "../mixins/passiveSupportMixin.js";

export default {
  components: {
    VueDraggableNext
  },
  mixins: [passiveSupportMixin],
  props: ["items"],
  data() {
    return {
      // A bunch of items with numbers from 1 to N, should be a props ideally
      // Total height of the root which contains all the list items in px
      rootHeight: 400,
      // Height of each row, give it an initial value but this gets calculated dynamically on mounted
      rowHeight: 60,
      // Current scroll top position, we update this inside the scroll event handler
      scrollTop: 0,
      // Extra padding at the top and bottom so that the items transition smoothly
      // Think of it as extra items just before the viewport starts and just after the viewport ends
      nodePadding: 0,
    };
  },
  computed: {
    /**
    Total height of the viewport = number of items in the array x height of each item
    */
    viewportHeight() {
      //console.log('viewportHeight total item :' + this.itemCount);
      console.log('viewportHeight rowHeight item :' + this.rowHeight);
      //console.log('viewportHeight total length :' + this.itemCount * this.rowHeight);
      return this.itemCount * this.rowHeight;
    },
    /**
    Out of all the items in the massive array, we only render a subset of them
    This is the starting index from which we show a few items
    */
    startIndex() {
      let startNode =
        Math.floor(this.scrollTop / this.rowHeight) - this.nodePadding;
      startNode = Math.max(0, startNode);
      return startNode;
    },
    /**
    This is the number of items we show after the starting index
    If the array has a total 10000 items, we want to show items from say index 1049 till 1069
    visible node count is that number 20 and starting index is 1049
    */
    visibleNodeCount() {
      let count =
        Math.ceil(this.rootHeight / this.rowHeight) + 2 * this.nodePadding;
      count = Math.min(this.itemCount - this.startIndex, count);
      return count;
    },
    /**
    Subset of items shown from the full array
    */
    visibleItems() {
      return this.items.slice(
        this.startIndex,
        this.startIndex + this.visibleNodeCount
      );
    },
    itemCount() {
      //console.log('itemCount change');
      return this.items.length;
    },
    /**
    The amount by which we need to translateY the items shown on the screen so that the scrollbar shows up correctly
    */
    offsetY() {
      return this.startIndex * this.rowHeight;
    },
    /**
    This is the direct list container, we apply a translateY to this
    */
    spacerStyle() {
      return {
        transform: "translateY(" + this.offsetY + "px)",
      };
    },
    viewportStyle() {
      return {
        overflow: "hidden",
        height: this.viewportHeight + "px",
        position: "relative",
      };
    },
    rootStyle() {
      return {
        // height: this.rootHeight + "px",
        maxHeight: this.rootHeight + "px",
        overflow: "auto",
      };
    },
  },
  methods: {
    handleScroll() {
      this.scrollTop = this.$refs.root.scrollTop;
    },
    /**
    Find the largest height amongst all the children
    Remember each row has to be of the same height
    I am working on the different height version
    */
    calculateInitialRowHeight() {
      // const children = this.$refs.spacer.children;
      const children = this.$refs.spacer.$el.children;
      // console.log('children moutned : ',this.$refs.spacer.$el.children);
      // console.log(children[0])
      let largestHeight = 1;
      for (let i = 0; i < children.length; i++) {
        if (children[i].offsetHeight > largestHeight) {
          // + 10 = add thêm height để hiển thị
          largestHeight = children[i].offsetHeight + 10;
        }
      }
      // console.log('Largest height : ',largestHeight);
      return largestHeight;
    },
    /**Draggable option */
    dragOptions() {
      return {
        animation: "200",
        ghostClass: "ghost",
        group: "kanban-board-list-items"
        // disabled: this.isEditing || !this.shouldAllowTaskItemsReorder
      };
    },
    initCalculateInitialRowHeight() {
      // Calculate that initial row height dynamically
      const largestHeight = this.calculateInitialRowHeight();
      //console.log(largestHeight)
      this.rowHeight =
        typeof largestHeight !== "undefined" && largestHeight !== null
          ? largestHeight
          : this.rowHeight;
    },
    handleEndDrag(){}
  },
  mounted() {
    //console.log("mounted again");
    this.$refs.root.addEventListener(
      "scroll",
      this.handleScroll,
      this.doesBrowserSupportPassiveScroll() ? { passive: true } : false,
    );
    this.initCalculateInitialRowHeight();
  },
  unmounted() {
    this.$refs.root.removeEventListener("scroll", this.handleScroll);
  },
  updated() {
    this.initCalculateInitialRowHeight();
  }
};
</script>
<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  height: 100%;
}

body {
  min-height: 100%;
  height: 100%;
  font-family: "Noto Sans", "Tahoma", sans-serif;
  display: flex;
  flex-direction: column;
  color: rgba(0, 0, 0, 0.6);
  padding: 1.25rem;
}

header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;
}

#app {
  height: 100%;
}

.viewport {
  background: #fefefe;
  overflow-y: auto;
}

.spacer>div {
  padding: 0.5rem 0rem;
  border: 1px solid #f5f5f5;
}
</style>
