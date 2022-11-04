import { createStore } from "vuex";

import rootMutations from "./mutations.js";
import rootActions from "./actions.js";
import rootGetters from "./getters.js";

function loopData() {
  let arr=[];
  for(let i=1;i<=100000;i++){
    arr.push({
      listId: 1,
      id: i,
      name:`card ${i}`,
    });
  }
  for(let i=1;i<=15;i++){
    arr.push({
      listId: 2,
      id: i,
      name:`card ${i}`,
    });
  }
  return arr;
}

const store = createStore({
  state() {
    return {
      overlay: false,
      lastListId: 3,
      lastCardId: 5,
      currentData: null,
      lists: [
        {
          id: 1,
          name: "list #1",
        },
        {
          id: 2,
          name: "list #2",
        },
        {
          id: 3,
          name: "list #3",
        },
      ],
      cards: loopData(),
    };
  },
  mutations: rootMutations,
  actions: rootActions,
  getters: rootGetters,
});


export default store;