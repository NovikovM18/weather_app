const selectedLang = JSON.parse(localStorage.getItem('selectedLang'));

const initialState = {
	selectedLang: selectedLang || 'en'
}
  
export const lang = {
	state: initialState,
	actions: {
		setLang(context, payload) {
      context.commit('SET_LANG', payload);
		}
	},
	mutations: {
    SET_LANG(state, payload) {
      state.selectedLang = payload;
      localStorage.setItem('selectedLang', JSON.stringify(state.selectedLang));
		}
	}
}