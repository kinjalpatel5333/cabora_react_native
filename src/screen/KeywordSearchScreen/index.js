import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {images} from '../../assets';
import {PLATFORM_META, PLATFORMS} from '../../config/staticSearchData';
import {useSidebar} from '../../context/SidebarContext';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {
  loadMore,
  runKeywordSearch,
  setKeyword,
  setPlatform,
} from '../../redux/slices/searchSlice';
import styles from './style';

const TIER_BG = {
  HOT: '#BE123C',
  RISING: '#7E22CE',
  WARM: '#C2410C',
  WATCH: 'rgba(255,255,255,0.12)',
};

const MIX_STYLE = {
  instagram: styles.mixSegIg,
  tiktok: styles.mixSegTt,
  youtube: styles.mixSegYt,
};

function ResultCard({item}) {
  const meta = PLATFORM_META[item.platform];
  return (
    <View style={styles.card}>
      <View style={[styles.thumb, {backgroundColor: item.thumb}]}>
        <View style={styles.overlayRow} pointerEvents="none">
          {item.isTop ? (
            <View style={styles.topPick}>
              <Text style={styles.topPickText}>TOP PICK</Text>
            </View>
          ) : (
            <View />
          )}
          <View style={styles.platBadge}>
            <Text style={styles.platBadgeText}>{meta.name}</Text>
          </View>
        </View>
        <View style={styles.play}>
          <View style={styles.playTri} />
        </View>
        {item.duration ? (
          <Text style={styles.duration}>{item.duration}</Text>
        ) : null}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.author}>{item.author}</Text>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{item.views} views</Text>
          <Text style={styles.meta}>{item.likes} likes</Text>
          <Text style={styles.score}>{item.score}</Text>
          <View style={[styles.tier, {backgroundColor: TIER_BG[item.tier]}]}>
            <Text style={styles.tierText}>{item.tier}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Pressable
            style={styles.saveBtn}
            onPress={() => Alert.alert('Saved', 'Demo: post saved locally.')}>
            <Text style={styles.saveText}>Save Post</Text>
          </Pressable>
          <Pressable
            style={styles.analyzeBtn}
            onPress={() => Alert.alert('Analyze', 'Demo analyze action.')}>
            <Text style={styles.analyzeText}>Analyze</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function StatsHero({platform, stats}) {
  if (platform === 'all') {
    return (
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroKicker}>{stats.kicker}</Text>
            <View style={styles.heroValueRow}>
              <Text style={styles.heroValue}>{stats.value}</Text>
              <Text style={styles.heroUnit}>{stats.unit}</Text>
              <Text style={styles.heroUnitLabel}>{stats.unitLabel}</Text>
            </View>
          </View>
          {stats.live ? (
            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.mixBar}>
          {(stats.mix || []).map(row => (
            <View
              key={row.platform}
              style={[MIX_STYLE[row.platform], {flex: row.share}]}
            />
          ))}
        </View>
        {(stats.mix || []).map(row => (
          <View key={row.platform} style={styles.mixRow}>
            <View
              style={[
                styles.mixSwatch,
                {backgroundColor: PLATFORM_META[row.platform].tint},
              ]}
            />
            <Text style={styles.mixName}>{row.label}</Text>
            <Text style={styles.mixCount}>{row.count}</Text>
          </View>
        ))}
        <View style={styles.metrics}>
          {(stats.metrics || []).map(m => (
            <View key={m.label} style={styles.metric}>
              <Text style={styles.metricValue}>{m.value}</Text>
              <Text style={styles.metricLabel}>{m.label}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.hero}>
      <Text style={styles.heroKicker}>{stats.retrieved}</Text>
      <View style={styles.split}>
        <View style={styles.splitCol}>
          <Text style={styles.heroKicker}>{stats.kicker}</Text>
          <View style={styles.heroValueRow}>
            <Text style={styles.heroValue}>{stats.value}</Text>
            <Text style={styles.heroUnit}>{stats.unit}</Text>
          </View>
          <Text style={styles.hint}>{stats.hint}</Text>
        </View>
        <View style={styles.splitCol}>
          <Text style={styles.heroKicker}>{stats.avgLabel}</Text>
          <View style={styles.heroValueRow}>
            <Text style={[styles.heroValue, {fontSize: 28, lineHeight: 32}]}>
              {stats.avgValue}
            </Text>
          </View>
          <Text style={styles.hint}>{stats.avgHint}</Text>
        </View>
      </View>
    </View>
  );
}

export default function KeywordSearchScreen() {
  const insets = useSafeAreaInsets();
  const {openDrawer} = useSidebar();
  const dispatch = useAppDispatch();
  const {keyword, platform, stats, posts, visibleCount, loading} =
    useAppSelector(s => s.search);
  const [draft, setDraft] = useState(keyword);

  const onSearch = () => {
    dispatch(setKeyword(draft.trim() || 'gym transformation'));
  };

  useEffect(() => {
    dispatch(runKeywordSearch({keyword, platform}));
  }, [dispatch, keyword, platform]);

  const visible = posts.slice(0, visibleCount);
  const remaining = Math.max(0, posts.length - visibleCount);

  return (
    <View style={styles.root}>
      <View style={[styles.header, {paddingTop: insets.top + 6}]}>
        <View style={styles.navRow}>
          <Pressable onPress={openDrawer} hitSlop={10}>
            <Image source={images.iconMenu} style={styles.menu} />
          </Pressable>
          <Text style={styles.resultsEy}>RESULTS FOR</Text>
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.keyword} numberOfLines={1}>
            {keyword}
          </Text>
          <Text style={styles.count}>{stats?.retrieved}</Text>
        </View>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={onSearch}
          placeholder="Search a keyword…"
          placeholderTextColor="rgba(255,255,255,0.35)"
          autoCapitalize="none"
          returnKeyType="search"
          style={styles.searchBox}
        />
      </View>

      <View style={styles.tabs}>
        {PLATFORMS.map(key => {
          const on = platform === key;
          return (
            <Pressable
              key={key}
              onPress={() => dispatch(setPlatform(key))}
              style={[styles.tab, on ? styles.tabOn : styles.tabIdle]}>
              <Text style={[styles.tabName, {color: on ? '#F9A8D4' : '#fff'}]}>
                {PLATFORM_META[key].name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {loading && !posts.length ? (
        <ActivityIndicator color="#EC4899" style={{marginTop: 40}} />
      ) : (
        <FlatList
          data={visible}
          keyExtractor={item => item.id}
          contentContainerStyle={[styles.list, {paddingBottom: insets.bottom + 24}]}
          ListHeaderComponent={
            <>
              <StatsHero platform={platform} stats={stats} />
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Top results</Text>
                <View style={styles.sectionLine} />
              </View>
            </>
          }
          renderItem={({item}) => <ResultCard item={item} />}
          ListEmptyComponent={
            <Text style={styles.empty}>No posts for this keyword yet.</Text>
          }
          ListFooterComponent={
            remaining > 0 ? (
              <Pressable style={styles.loadMore} onPress={() => dispatch(loadMore())}>
                <Text style={styles.loadMoreText}>
                  Load {Math.min(remaining, 4)} more
                </Text>
              </Pressable>
            ) : null
          }
        />
      )}
    </View>
  );
}
