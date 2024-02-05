/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Mon, 16th Oct 2023, 13:46:18 pm
 * Author: Nawaf Ibrahim (nawaf.ibrahim@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';

import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import {Text} from '@rneui/themed';
import {Spacer} from 'components/utils/spacer';
import {ChargeValueCard} from 'components/cards/charge-value-card';
import {SecondaryButton} from 'components/buttons/secondary-button';
import {MarketingBannerCard} from 'components/cards/marketing-banner-card';
import {StackScreenProps} from '@react-navigation/stack';
import {
  ACCOUNT_SCREENS,
  CHARGING_SCREENS,
  ChargingContainerParamList,
} from '../../types/navigation';
import {PrimaryButton} from 'components/buttons/primary-button';
import {InfoListCard} from 'components/cards/info-list-card';
import DefaultHeader from 'components/headers/default-header';
import {ScrollOffset} from 'components/utils/scroll-offset';
import {LottieIcon} from 'utils/lottie-icon';
import {useSite} from 'providers/apis/site';
import useChargeSessionSubscription from 'providers/client/apollo/subscriptions-hooks/charge-session-update';
import {useProfile} from 'providers/apis/profile';
import {useCharging} from 'providers/apis/charging';
import {
  ChargepointTariff,
  ChargingRequestParams,
  ChargingSessionAPIResponse,
  ChargingSessionMappedResponse,
} from 'providers/types/charging';
import {Support} from 'providers/types/site';

const ChargingAnimation = require('../../../assets/lottie/charging.json');
const ChargingBolt = require('../../../assets/svg/charging-bolt.svg').default;

import {
  CHARGING_ACTIONS,
  SOCIAL_ICONS,
  TRANSACTION_TYPE,
} from 'utils/constants';
import {useNavigation, useRoute} from '@react-navigation/native';
import {convertSecondsToHoursMinutesSeconds} from 'utils/general-utils';
import ChargingCompleteModal from 'components/modals/charging-complete-modal';
import {useAlert} from 'providers/alert/alert-provider';
import {useLoading} from 'providers/loading/loading-provider';
import {useAuth} from 'providers/apis/auth';
import {usePrevious} from 'utils/usePrevious';

interface CurrentlyChargingProps
  extends StackScreenProps<ChargingContainerParamList> {
  testID?: string;
  siteID?: string;
}
interface sessionDetailCards {
  iconName: string;
  value: string;
  valueDescription: string;
}
const CurrentlyCharging = (props: CurrentlyChargingProps) => {
  const {testID = 'currentlyChargingScreen'} = props;
  const {coloursTheme, textStyles} = useStyle();
  const {getHeight, getWidth, getRadius} = useScale();
  const {
    dictionary: {Charging, Errors, PersonalDetails},
  } = useDictionary();

  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const tabs = {
    session: Charging.Session,
    info: Charging.Info,
    support: Charging.Support,
  };
  const [selectedTab, setSelectedTab] = useState(tabs.session);
  const [chargingStopped, setChargingStopped] = useState(false);

  const {profile} = useProfile();
  const {getCurrentChargingSession, stopChargingSession, getChargepointTariff} =
    useCharging();

  const {chargepoint_id, emp_session_id}: any =
    props?.route?.params ?? route?.params?.returningFromFAQScreenParams;

  const [currentSession, setCurrentSession] = useState<
    ChargingSessionMappedResponse | undefined
  >();

  const {data: subscribedData, error} = useChargeSessionSubscription({
    chargepoint_id: chargepoint_id,
    emp_session_id: emp_session_id,
  });

  const {setButtonLoading} = useLoading();

  const scrollRef = useRef<ScrollView>(null);

  const prevSelectedTab = usePrevious(selectedTab);

  useEffect(() => {
    if (selectedTab !== prevSelectedTab) {
      scrollRef.current?.scrollTo({y: 0, animated: false});
    }
  }, [prevSelectedTab, selectedTab]);

  // Get initial full session data
  useEffect(() => {
    if (chargepoint_id) {
      getCurrentChargingSession({
        chargepoint_id: chargepoint_id,
      }).then(response => {
        console.log('getCurrentChargingSession response: ', response);
        if (response.success && response.data?.sessionData) {
          setCurrentSession(response.data);
        }
      });
    }
  }, [chargepoint_id, getCurrentChargingSession, setCurrentSession]);

  useEffect(() => {
    if (subscribedData && !error) {
      const data = subscribedData as ChargingSessionAPIResponse;

      if (data?.sdr?.length && data.sdr[0]) {
        const sessionUpdate = data.sdr!![0];
        setCurrentSession((prev: ChargingSessionMappedResponse | undefined) => {
          const {sdr_state} = sessionUpdate;
          let totalEnergy = prev?.sessionData?.total;
          let sessionLength = prev?.sessionData?.sessionSummary?.sessionLength;

          if (sdr_state?.start_meter && sdr_state?.end_meter) {
            totalEnergy =
              (sdr_state!!.end_meter - sdr_state!!.start_meter) / 1000;
          }

          if (sdr_state?.updated_at && sdr_state?.start_time) {
            sessionLength =
              (new Date(sdr_state!!.updated_at).getTime() -
                new Date(sdr_state!!.start_time).getTime()) /
              1000;
          }

          return {
            ...prev,
            sessionData: {
              ...prev?.sessionData,
              sessionSummary: {
                ...prev?.sessionData?.sessionSummary,
                sessionLength: sessionLength,
                totalCost: sdr_state?.estimated_cost,
                totalEnergy: totalEnergy,
              },
              total: sdr_state?.estimated_cost,
              state: sessionUpdate?.state,
            },
          };
        });

        // Update UI if charging stopped remotely
        if (sessionUpdate.state === 'closed') {
          setChargingStopped(true);
        }

        if (chargingStopped && sessionUpdate.state !== 'running') {
          setButtonLoading(false);
        }
      }
    }
  }, [
    chargingStopped,
    error,
    setButtonLoading,
    setCurrentSession,
    subscribedData,
  ]);

  const {getSupport} = useSite();

  const [supportInformation, setSupportInformation] = useState<Support | null>(
    null,
  );

  const handleLinkPress = (url: string) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  };

  const fetchSupport = useCallback(async () => {
    const response = await getSupport();

    if (response?.data) {
      setSupportInformation(response?.data);
    }
  }, [getSupport]);

  useEffect(() => {
    fetchSupport();
  }, [fetchSupport]);

  const [tarrif, setTarrif] = useState<ChargepointTariff | null>(null);

  useEffect(() => {
    if (tarrif === null) {
      getChargepointTariff({charging_point: chargepoint_id}).then(response => {
        if (response.success) {
          setTarrif(response.data || null);
        }
      });
    }
  }, [chargepoint_id, getChargepointTariff, tarrif]);

  const [showFinishedModal, setShowFinishedModal] = useState(false);
  const {alert} = useAlert();
  const {logout} = useAuth();

  const stopCharge = useCallback(async () => {
    try {
      setButtonLoading(true);
      if (
        chargepoint_id &&
        currentSession?.sessionData?.connectorId &&
        currentSession?.sessionData?.sessionSummary?.emp_session_id &&
        profile?.cardtag
      ) {
        const postBody: ChargingRequestParams = {
          action: CHARGING_ACTIONS.STOP,
          chargepoint: chargepoint_id,
          connector: currentSession?.sessionData?.connectorId,
          transaction_type: TRANSACTION_TYPE.NEW,
          emp_session_id:
            currentSession?.sessionData?.sessionSummary?.emp_session_id,
          tag: profile?.cardtag,
        };

        stopChargingSession(postBody).then(response => {
          if (response.success && response.data?.status) {
            setChargingStopped(true);
          } else if (response.error?.code === 'CLIENT_ERROR') {
            alert(Errors.ChargingAuth.Title, Errors.ChargingAuth.Description, [
              {
                onPress: () => {
                  const success = logout();

                  if (success) {
                    navigation.navigate(ACCOUNT_SCREENS.SIGN_IN);
                  }
                },
                text: PersonalDetails.AcceptText,
              },
              {
                text: PersonalDetails.CancelText,
                style: 'cancel',
              },
            ]);
          } else {
            alert(
              Errors.ChargingAuth.Title,
              response.data?.message || response.error?.message,
            );
          }
        });
      }
    } catch (e) {
      console.log('error: ', e);
    }
  }, [
    chargepoint_id,
    currentSession?.sessionData?.connectorId,
    currentSession?.sessionData?.sessionSummary?.emp_session_id,
    profile?.cardtag,
    setButtonLoading,
    stopChargingSession,
    alert,
    Errors.ChargingAuth.Title,
    Errors.ChargingAuth.Description,
    PersonalDetails.AcceptText,
    PersonalDetails.CancelText,
    logout,
    navigation,
  ]);

  const sessionData: sessionDetailCards[] = useMemo(
    () => [
      {
        iconName: 'coins',
        value: `£${
          currentSession?.sessionData?.sessionSummary?.totalCost
            ? currentSession.sessionData.sessionSummary?.totalCost.toFixed(2)
            : '0.00'
        }`,
        valueDescription: Charging.CurrentCost,
      },
      {
        iconName: 'bolt',
        value: `£${
          tarrif?.data?.dc_price
            ? (tarrif?.data?.dc_price / 100).toFixed(2)
            : '0.00'
        }`,
        valueDescription: Charging.PricePerKWH,
      },
      {
        iconName: 'plug',
        value: `${
          currentSession?.sessionData?.sessionSummary?.totalEnergy || 0
        } kWh`,
        valueDescription: Charging.SessionEnergy,
      },
    ],
    [currentSession, Charging, tarrif?.data?.dc_price],
  );

  const infoData = useMemo(() => {
    const connector = currentSession?.sessionData?.connector?.connector_type;

    const data = [
      {
        title: Charging.StationDetails,
        iconAndDescriptionList: [
          {
            iconName: 'charging-station',
            description:
              currentSession?.sessionData?.sessionSummary?.chargeStation
                ?.display_name || chargepoint_id,
          },
          {
            customIcon:
              connector?.icon ||
              require('../../../assets/svg/connector-types/other-connectors.svg')
                .default,
            description: connector?.name || 'Other',
          },
          {
            iconName: 'bolt',
            description: `${currentSession?.sessionData?.connector?.max_charge_rate} kW`,
          },
        ],
      },
      // Not in R2
      // {
      //   title: Charging.SessionPreSetDetails,
      //   iconAndDescriptionList: [
      //     {
      //       iconName: 'clock',
      //       description: '02h 10m',
      //     },
      //   ],
      // },
    ];

    // Check if provider exists, then add the last object
    if (currentSession?.sessionData?.provider) {
      data.push({
        title: Charging.OperatorInformation,
        iconAndDescriptionList: [
          {
            iconName: 'info',
            description: currentSession?.sessionData?.provider,
          },
        ],
      });
    }

    return data;
  }, [
    Charging.StationDetails,
    Charging.OperatorInformation,
    currentSession?.sessionData?.sessionSummary?.chargeStation?.display_name,
    currentSession?.sessionData?.connector?.max_charge_rate,
    currentSession?.sessionData?.connector?.connector_type,
    currentSession?.sessionData?.provider,
    chargepoint_id,
  ]);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    topHalfContainer: {
      paddingHorizontal: getWidth(20),
      height: getHeight(354),
      justifyContent: 'flex-end',
      backgroundColor: coloursTheme.currentlyCharging.headerBackground,
      alignItems: 'center',
      borderBottomColor:
        coloursTheme.currentlyCharging.tab.inactiveBottomBorder,
      borderBottomWidth: getHeight(2),
    },
    innerChargingCircle: {
      height: getHeight(160),
      aspectRatio: 1,
      backgroundColor: coloursTheme.card.backgroundColor,
      borderRadius: getRadius(80),
      top: getHeight(185),
      left: getHeight(25), //using getHeight as it's a circle to avoid distortion
      zIndex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    chargingInfographicValue: {...textStyles.semiBold28},
    chargingInfographicUnit: {...textStyles.semiBold18},
    stopChargingButton: {
      marginBottom: getHeight(25),
    },
    tabsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    tab: {
      paddingTop: getHeight(5),
      paddingBottom: getHeight(4),
      width: getWidth(76),
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: getWidth(10),
    },
    selectedTabIndicator: {
      width: getWidth(76),
      borderBottomWidth: getHeight(2),
      borderBottomColor: coloursTheme.currentlyCharging.tab.activeBottomBorder,
      position: 'absolute',
      bottom: getHeight(-2),
    },
    tabText: {...textStyles.regular16},
    bottomHalfContainer: {
      paddingHorizontal: getWidth(20),
      paddingTop: getHeight(26),
      backgroundColor: coloursTheme.backgroundColor,
      flex: 1,
    },
    setupSessionButton: {alignSelf: 'center', marginBottom: getHeight(30)},

    supportTabCard: {
      padding: getWidth(20),
      alignItems: 'center',
      backgroundColor: coloursTheme.card.backgroundColor,
      borderRadius: getRadius(10),
    },

    needHelpTitle: {
      ...textStyles.semiBold20,
      marginBottom: getHeight(15),
    },
    needHelpDescription: {
      ...textStyles.regular16,
      textAlign: 'center',
      marginBottom: getHeight(15),
      width: '100%',
    },
    supportTabButton: {
      width: getWidth(295),
      marginTop: getHeight(10),
    },
    faqTitle: {
      ...textStyles.semiBold20,
      marginBottom: getHeight(10),
    },
    socialButtonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    visitSocialsTitle: {
      ...textStyles.semiBold18,
      marginBottom: getHeight(15),
    },
    iconStyle: {
      marginHorizontal: getWidth(12),
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  const SessionTab = useCallback(
    () => (
      <>
        {sessionData?.map((item, i) => {
          return (
            <Fragment key={i}>
              <ChargeValueCard
                iconName={item.iconName}
                value={item.value}
                valueDescription={item.valueDescription}
                testID={`${testID}.sessionTab.${item.valueDescription}`}
              />
              <Spacer vertical size={10} />
            </Fragment>
          );
        })}
        <Spacer size={30} />

        {/* Not in R2 */}
        {/* <SecondaryButton
          title={Charging.SetupSessionDetails}
          containerStyle={styles.setupSessionButton}
          testID={`${testID}.sessionTab.setupSessionButton`}
        /> */}
      </>
    ),
    [sessionData, testID],
  );

  const InfoTab = useCallback(
    () => (
      <>
        {infoData?.map((item, i) => {
          return (
            <Fragment key={i}>
              <InfoListCard
                title={item?.title}
                iconAndDescriptionList={item?.iconAndDescriptionList}
              />
              <Spacer vertical size={10} />
            </Fragment>
          );
        })}
        <Spacer size={30} />
      </>
    ),
    [infoData],
  );

  const SupportTab = useCallback(
    () => (
      <>
        <View
          style={styles.supportTabCard}
          testID={`${testID}.supportTab.needHelpOrSupportCard`}>
          <Text
            style={styles.needHelpTitle}
            testID={`${testID}.supportTab.needHelpOrSupportCard.title`}>
            {Charging.NeedHelpOrSupportTitle}
          </Text>
          <Text
            style={styles.needHelpDescription}
            testID={`${testID}.supportTab.needHelpOrSupportCard.description`}>
            {Charging.NeedHelpOrSupportDescription}
          </Text>
          <PrimaryButton
            title={Charging.EmailSupportTeam}
            containerStyle={styles.supportTabButton}
            testID={`${testID}.supportTab.needHelpOrSupportCard.emailSupportTeamButton`}
            onPress={() =>
              handleLinkPress(`mailto:${supportInformation?.email}`)
            }
          />
          <SecondaryButton
            title={Charging.CallSupportTeam}
            containerStyle={styles.supportTabButton}
            testID={`${testID}.supportTab.needHelpOrSupportCard.callSupportTeamButton`}
            onPress={() => handleLinkPress(`tel:${supportInformation?.phone}`)}
          />
        </View>
        <Spacer vertical size={15} testID={`${testID}.supportTab.spacer.1`} />
        <View
          style={styles.supportTabCard}
          testID={`${testID}.supportTab.faqCard`}>
          <Text
            style={styles.faqTitle}
            testID={`${testID}.supportTab.faqCard.title`}>
            {Charging.FaqsTitle}
          </Text>
          <PrimaryButton
            title={Charging.ViewFaqs}
            containerStyle={styles.supportTabButton}
            testID={`${testID}.supportTab.faqCard.viewFaqsButton`}
            onPress={() =>
              navigation.navigate(ACCOUNT_SCREENS.FAQS, {
                tab: route.name,
                returningFromFAQScreenParams: {chargepoint_id, emp_session_id},
              })
            }
          />
        </View>
        {supportInformation?.support_socials?.length && (
          <>
            <Spacer
              vertical
              size={15}
              testID={`${testID}.supportTab.spacer.2`}
            />
            <View
              style={styles.supportTabCard}
              testID={`${testID}.visitSocialsCard`}>
              <Text
                style={styles.visitSocialsTitle}
                testID={`${testID}.supportTab.visitSocialsCard.title`}>
                {Charging.VisitSocialsTitle}
              </Text>
              <View
                style={styles.socialButtonsRow}
                testID={`${testID}.supportTab.visitSocialsCard.socialButtonsRow`}>
                {supportInformation?.support_socials?.map(
                  ({type, url}, _index) => {
                    const Icon = SOCIAL_ICONS[type];

                    return (
                      <TouchableOpacity style={styles.iconStyle} key={url}>
                        <Icon />
                      </TouchableOpacity>
                    );
                  },
                )}
              </View>
            </View>
          </>
        )}
        <Spacer vertical size={30} testID={`${testID}.supportTab.spacer.3`} />
      </>
    ),
    [
      styles,
      testID,
      Charging,
      supportInformation,
      navigation,
      route.name,
      chargepoint_id,
      emp_session_id,
    ],
  );

  const InfoGraphicValue = useCallback(() => {
    const duration = convertSecondsToHoursMinutesSeconds(
      currentSession?.sessionData?.sessionSummary?.sessionLength ?? 0,
    );
    return (
      <Text style={styles.chargingInfographicValue}>
        {duration.hours}
        <Text style={styles.chargingInfographicUnit}> h </Text>
        <Text>{duration.minutes}</Text>
        <Text style={styles.chargingInfographicUnit}> m</Text>
      </Text>
    );
  }, [
    currentSession,
    styles.chargingInfographicUnit,
    styles.chargingInfographicValue,
  ]);

  return (
    <>
      <ScrollOffset
        backgroundColour={coloursTheme.currentlyCharging.headerBackground}
        testID={`${testID}.scrollOffset`}
      />
      <View style={styles.container} testID={testID}>
        <DefaultHeader
          title={Charging.CurrentlyCharging}
          backgroundColor={coloursTheme.currentlyCharging.headerBackground}
          hideGoBack
        />
        <View
          style={styles.topHalfContainer}
          testID={`${testID}.topHalfContainer`}>
          <View testID={`${testID}.chargingInfographic`}>
            <View
              style={styles.innerChargingCircle}
              testID={`${testID}.chargingInfographic.innerCircle`}>
              <ChargingBolt
                width={getWidth(31.5)}
                height={getHeight(42)}
                testID={`${testID}.chargingInfographic.innerCircle.bolt`}
              />
              <Spacer vertical size={15} testID={`${testID}.spacer.1`} />
              <InfoGraphicValue />
            </View>
            <LottieIcon
              lottieJSON={ChargingAnimation}
              animate={!chargingStopped}
              testID={`${testID}.chargingInfographic.lottie`}
              customHeight={getHeight(210)}
              customWidth={getHeight(210)} //using getHeight as it's a circle to avoid distortion
            />
          </View>
          <Spacer vertical size={30} testID={`${testID}.spacer.2`} />
          <PrimaryButton
            title={
              !chargingStopped ? Charging.StopCharging : Charging.FinishSession
            }
            containerStyle={styles.stopChargingButton}
            testID={
              !chargingStopped
                ? `${testID}.stopChargingButton`
                : `${testID}.finishSessionButton`
            }
            onPress={
              !chargingStopped ? stopCharge : () => setShowFinishedModal(true)
            }
            showLoading
          />
          <View style={styles.tabsContainer} testID={`${testID}.tabsContainer`}>
            {Object.values(tabs).map((tab, i) => (
              <TouchableOpacity
                key={i}
                style={styles.tab}
                onPress={() => setSelectedTab(tab)}
                testID={`${testID}.tab`}>
                <Text style={styles.tabText} testID={`${testID}.tab.text`}>
                  {tab}
                </Text>
                {tab === selectedTab && (
                  <View
                    style={styles.selectedTabIndicator}
                    testID={`${testID}.tab.selectedTabIndicator`}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <ScrollView
          ref={scrollRef}
          style={styles.bottomHalfContainer}
          testID={`${testID}.bottomHalfContainer`}
          showsVerticalScrollIndicator={false}>
          {(() => {
            switch (selectedTab) {
              case tabs.session:
                return <SessionTab />;
              case tabs.info:
                return <InfoTab />;
              default:
                return <SupportTab />;
            }
          })()}
          <MarketingBannerCard testID={`${testID}.session.marketingBanner`} />
          <Spacer
            vertical
            size={150}
            testID={`${testID}.bottomScreenPadding`}
          />
        </ScrollView>
      </View>

      <ChargingCompleteModal
        modalVisible={showFinishedModal}
        chargepointID={chargepoint_id}
        sessionID={currentSession?.sessionData?.id!!}
        empID={emp_session_id}
        closeModal={() => {
          navigation.replace(CHARGING_SCREENS.INITIATE_CHARGING, {
            resetState: true,
          });
        }}
      />
    </>
  );
};

export default CurrentlyCharging;
