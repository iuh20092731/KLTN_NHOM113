const initialState = {
    categories: [],
};

const categoryReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'SET_CATEGORIES':
            return {
                ...state,
                categories: action.payload,
            };
        default:
            return state;
    }
};

export default categoryReducer; 