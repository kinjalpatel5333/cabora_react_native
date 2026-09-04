import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {keywordSearchApi} from '../../config/api';
import {DEMO_MODE} from '../../config/setting';
import {mockKeywordSearch} from '../../config/staticSearchData';

const PAGE_SIZE = 4;

const initialState = {
  keyword: 'gym transformation',
  platform: 'all',
  stats: mockKeywordSearch({keyword: 'gym transformation', platform: 'all'}).stats,
  posts: [],
  visibleCount: PAGE_SIZE,
  loading: false,
  error: null,
};

export const runKeywordSearch = createAsyncThunk(
  'search/run',
  async ({keyword, platform}, {rejectWithValue}) => {
    try {
      if (DEMO_MODE) {
        await new Promise(r => setTimeout(r, 450));
        return mockKeywordSearch({keyword, platform});
      }
      return await keywordSearchApi({keyword, platform});
    } catch (err) {
      if (DEMO_MODE) {
        return mockKeywordSearch({keyword, platform});
      }
      return rejectWithValue(err.message || 'Search failed');
    }
  },
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setKeyword(state, action) {
      state.keyword = action.payload;
    },
    setPlatform(state, action) {
      state.platform = action.payload;
    },
    loadMore(state) {
      state.visibleCount = Math.min(
        state.posts.length,
        state.visibleCount + PAGE_SIZE,
      );
    },
  },
  extraReducers: builder => {
    builder
      .addCase(runKeywordSearch.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(runKeywordSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.keyword = action.payload.keyword;
        state.platform = action.payload.platform;
        state.stats = action.payload.stats;
        state.posts = action.payload.posts;
        state.visibleCount = PAGE_SIZE;
      })
      .addCase(runKeywordSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Search failed';
      });
  },
});

export const {setKeyword, setPlatform, loadMore} = searchSlice.actions;
export const SEARCH_PAGE_SIZE = PAGE_SIZE;
export default searchSlice.reducer;
