<template>
  <div class="root" ref="root" :style="rootStyle">
    <div class="viewport" ref="viewport" :style="viewportStyle">
      <div class="spacer" ref="spacer" :style="spacerStyle">
        <span
      class="element-card"
      v-for="(card, index) in visibleItems"
      :key="index"
      @click="togglePopup(card)"
    >
      {{ card.name }}
    </span>
      </div>
    </div>
  </div>
</template>
<script>
// https://dev.to/adamklein/build-your-own-virtual-scroll-part-i-11ib
// define a mixin object
var passiveSupportMixin = {
  methods: {
    // This snippet is taken straight from https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    // It will only work on browser so if you are using in an SSR environment, keep your eyes open
    doesBrowserSupportPassiveScroll() {
      let passiveSupported = false;

      try {
        const options = {
          get passive() {
            // This function will be called when the browser
            //   attempts to access the passive property.
            passiveSupported = true;
            return false;
          },
        };

        window.addEventListener("test", null, options);
        window.removeEventListener("test", null, options);
      } catch (err) {
        passiveSupported = false;
      }
      return passiveSupported;
    },
  },
};

export default {
  mixins: [passiveSupportMixin],
  props : ["items"],
  data() {
    return {
      // A bunch of items with numbers from 1 to N, should be a props ideally
      // Total height of the root which contains all the list items in px
      rootHeight: 400,
      // Height of each row, give it an initial value but this gets calculated dynamically on mounted
      rowHeight: 30,
      // Current scroll top position, we update this inside the scroll event handler
      scrollTop: 0,
      // Extra padding at the top and bottom so that the items transition smoothly
      // Think of it as extra items just before the viewport starts and just after the viewport ends
      nodePadding: 20,
    };
  },
  computed: {
    /**
    Total height of the viewport = number of items in the array x height of each item
    */
    viewportHeight() {
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
        height: this.rootHeight + "px",
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
      const children = this.$refs.spacer.children;
      let largestHeight = 0;
      for (let i = 0; i < children.length; i++) {
        if (children[i].offsetHeight > largestHeight) {
          largestHeight = children[i].offsetHeight;
        }
      }
      return largestHeight;
    }
  },
mounted() {
    this.$refs.root.addEventListener(
      "scroll",
      this.handleScroll,
      this.doesBrowserSupportPassiveScroll() ? { passive: true } : false,
    );
    // Calculate that initial row height dynamically
    const largestHeight = this.calculateInitialRowHeight();
    this.rowHeight =
      typeof largestHeight !== "undefined" && largestHeight !== null
        ? largestHeight
        : 30;
  },
  unmounted() {
    this.$refs.root.removeEventListener("scroll", this.handleScroll);
  },
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

.spacer > div {
  padding: 0.5rem 0rem;
  border: 1px solid #f5f5f5;
}
</style>
