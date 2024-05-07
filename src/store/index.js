import { defineStore } from 'pinia';
import {useSettingsStore} from './settings';
import {useOrderBookStore} from './orderbook';

export const useMainStore = defineStore('main', () => {
  const settingsStore = useSettingsStore();
  const orderBookStore = useOrderBookStore();

  return { settingsStore, orderBookStore };
});
