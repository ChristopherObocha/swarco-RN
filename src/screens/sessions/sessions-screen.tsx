import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useNavigation} from '@react-navigation/native';
import {useCharging} from 'providers/apis/charging';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {usePrevious} from 'utils/usePrevious';

import DefaultHeader from 'components/headers/default-header';
import {Platform, StyleSheet, Text} from 'react-native';
import SearchInput from 'components/utils/search-input';
import ScreenContainer from 'components/containers/screen-container';
import CardContainer from 'components/cards/card-container';
import SessionIcon from 'assets/svg/session-icon.svg';
import UserIcon from 'assets/svg/user-icon.svg';
import {PrimaryButton} from 'components/buttons/primary-button';
import {Spacer} from 'components/utils/spacer';
import {getObject} from 'utils/storage-utils';
import {STORAGE} from 'utils/constants';
import {SecondaryButton} from 'components/buttons/secondary-button';
import {ACCOUNT_SCREENS, BOTTOM_TABS} from '../../types/navigation';
import SessionFilterModal from './session-filter-modal';
import {FlashList} from '@shopify/flash-list';
import SessionCard from 'components/sessions/session-card';
import {FilterParams, SdrData} from 'providers/types/charging';
import {useLoading} from 'providers/loading/loading-provider';
import {LoadingView} from 'components/utils/loading-view';

export interface FilterParamsState extends FilterParams {
  dateOption: string;
}

const SessionsScreen = () => {
  const flashlistRef = useRef<any>(null);

  const {
    dictionary: {Sessions},
  } = useDictionary();
  const isLoggedIn = !getObject(STORAGE.GUEST_TOKEN);
  const navigation = useNavigation<any>();

  const {loading, setLoading} = useLoading();

  const [showFilterModal, setShowFilterModal] = useState(false);

  const [searchString, setSearchString] = useState<string>('');
  const prevSearchString = usePrevious(searchString);
  const [sessions, setSessions] = useState<SdrData[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const {getSessionList} = useCharging();

  const [userHasSessions, setUserHasSessions] = useState<boolean>(false);

  const [filters, setFilters] = useState<FilterParamsState>({
    dateOption: '',
    date_from: '',
    date_to: '',
    price_from: undefined,
    price_to: undefined,
  });

  const hasFilters = useMemo(() => {
    const filterKeys = Object.keys(filters);

    return filterKeys.some(key => {
      // @ts-ignore
      return filters[key];
    });
  }, [filters]);

  const handleFetchSessions = useCallback(async () => {
    const pagination = {
      offset,
      limit: 10,
    };

    const filter = {
      date_from: filters.date_from,
      date_to: filters.date_to,
      price_from: filters.price_from,
      price_to: filters.price_to,
    };
    let chargePointID = searchString.length > 3 ? searchString : '';

    const params = {
      charging_point_id: chargePointID,
      pagination,
      filter,
    };

    try {
      const res = await getSessionList(params);
      const {data} = res;
      const sdrData = data?.sdr || [];

      if (sdrData.length) {
        // If there are sessions, set the userHasSessions flag to true
        // so that the buttons are shown and persists through filtering and searching
        setUserHasSessions(true);
      }

      if (chargePointID && searchString !== prevSearchString) {
        setSessions(
          [...sdrData].sort(
            (a, b) =>
              new Date(b.endDateTime ?? '').getTime() -
              new Date(a.endDateTime ?? '').getTime(),
          ),
        );
      } else {
        setSessions((prevSessions: SdrData[]) =>
          [...prevSessions, ...sdrData].sort(
            (a, b) =>
              new Date(b.endDateTime ?? '').getTime() -
              new Date(a.endDateTime ?? '').getTime(),
          ),
        );
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [
    filters,
    getSessionList,
    offset,
    prevSearchString,
    searchString,
    setLoading,
  ]);

  useEffect(() => {
    handleFetchSessions();
  }, [handleFetchSessions]);

  const handleSearchChange = useCallback(
    (value: string) => {
      flashlistRef?.current?.scrollToOffset({offset: 0, animated: false});

      if (offset > 0) {
        setOffset(0);
      }

      setSearchString(value);
    },
    [offset],
  );

  const saveFilters = useCallback(
    (newFilters: FilterParamsState, skipModalClose?: boolean) => {
      setLoading(true);
      const filterKeys = Object.keys(newFilters);

      filterKeys.forEach(key => {
        // @ts-ignore
        if (!newFilters[key]) {
          // @ts-ignore
          delete newFilters[key];
        }
      });
      setFilters(newFilters);
      flashlistRef?.current?.scrollToOffset({offset: 0, animated: false});

      if (offset > 0) {
        setOffset(0);
      }
      setSessions([]);

      if (!skipModalClose) {
        setShowFilterModal(false);
      }
    },
    [offset, setLoading],
  );

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getWidth, getHeight} = useScale();
  const {textStyles} = useStyle();
  const {bottom} = useSafeAreaInsets();
  const platformPadding = Platform.select({
    ios: getHeight(50),
    android: getHeight(120),
  }) as number;

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    searchInputContainer: {
      flex: 1,
    },
    cardContainer: {
      alignItems: 'center',
      paddingVertical: !isLoggedIn ? getHeight(50) : getHeight(30),
    },
    textCenter: {
      textAlign: 'center',
      letterSpacing: -0.7,
    },
    headerContainer: {
      paddingBottom: getHeight(20),
      marginTop: getHeight(10),
    },
    contentContainerStyle: {
      paddingBottom: bottom + platformPadding,
    },
  });

  const NoData = useMemo(() => {
    const titleString = userHasSessions
      ? Sessions.NoResults
      : Sessions.NoSessions;
    const descriptionString = userHasSessions
      ? Sessions.NoResultsDescription
      : Sessions.NoSessionsDescription;
    return (
      <CardContainer style={styles.cardContainer}>
        <SessionIcon height={getWidth(110)} width={getWidth(110)} />
        <Spacer size={getHeight(30)} vertical />
        <Text style={textStyles.semiBold20}>{titleString}</Text>
        <Spacer size={getHeight(15)} vertical />
        <Text style={[textStyles.regular18, styles.textCenter]}>
          {descriptionString}
        </Text>
        {/* Importing sessions missed out of this release */}
        {/* <PrimaryButton title={Sessions.ImportButton} /> */}
      </CardContainer>
    );
  }, [Sessions, getWidth, getHeight, textStyles, styles, userHasSessions]);

  const shouldShowButtons = useMemo(() => {
    return isLoggedIn && userHasSessions;
  }, [isLoggedIn, userHasSessions]);

  const renderDivider = () => <Spacer size={15} vertical />;

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <DefaultHeader
        title={Sessions.Header}
        // leftIcons={
        //   shouldShowButtons
        //     ? [
        //         {
        //           name: 'file-spreadsheet',
        //           isPro: true,
        //         },
        //       ]
        //     : []
        // }
        rightIcons={
          shouldShowButtons
            ? [
                {
                  name: 'sliders-h',
                  isPro: true,
                  onPress: () => setShowFilterModal(true),
                  selected: hasFilters,
                },
              ]
            : []
        }
        hideGoBack
        containerStyle={styles.headerContainer}
      />
      <ScreenContainer style={styles.container}>
        {shouldShowButtons && (
          <SearchInput
            inputContainerStyle={styles.searchInputContainer}
            hideShadow
            placeholder={Sessions.SearchPlaceholder}
            onSearch={handleSearchChange}
            value={searchString}
            autoCapitalize="words"
            clearSearch={() => {
              handleSearchChange('');
            }}
          />
        )}
        <Spacer size={getHeight(15)} vertical />
        {isLoggedIn ? (
          <FlashList
            ref={flashlistRef}
            data={sessions}
            renderItem={({item}) => <SessionCard session={item} />}
            ItemSeparatorComponent={renderDivider}
            ListEmptyComponent={NoData}
            extraData={sessions}
            contentContainerStyle={styles.contentContainerStyle}
            showsVerticalScrollIndicator={false}
            onEndReached={() => setOffset(offset + 10)}
            onEndReachedThreshold={0.5}
            estimatedItemSize={getHeight(200)}
          />
        ) : (
          <CardContainer style={styles.cardContainer}>
            <UserIcon height={getWidth(180)} width={getWidth(180)} />
            <Spacer size={getHeight(25)} vertical />
            <Text style={textStyles.semiBold20}>
              {Sessions.AccountRequired}
            </Text>
            <Spacer size={getHeight(10)} vertical />
            <Text style={[textStyles.regular18, styles.textCenter]}>
              {Sessions.AccountRequiredDescription}
            </Text>
            <Spacer size={getHeight(20)} vertical />
            <PrimaryButton
              title={Sessions.SignInCTA}
              customWidth={getWidth(295)}
              onPress={() =>
                navigation.navigate(ACCOUNT_SCREENS.SIGN_IN, {
                  redirect: BOTTOM_TABS.SESSION_CONTAINER,
                })
              }
            />
            <Spacer size={getHeight(15)} vertical />
            <SecondaryButton
              title={Sessions.CreateAccountCTA}
              customWidth={getWidth(295)}
              onPress={() =>
                navigation.navigate(ACCOUNT_SCREENS.CREATE_ACCOUNT, {
                  redirect: BOTTOM_TABS.SESSION_CONTAINER,
                })
              }
            />
          </CardContainer>
        )}
      </ScreenContainer>
      <SessionFilterModal
        modalVisible={showFilterModal}
        closeModal={() => setShowFilterModal(false)}
        saveFunction={saveFilters}
        filters={filters}
      />
      {loading && <LoadingView />}
    </>
  );
};

export default SessionsScreen;
