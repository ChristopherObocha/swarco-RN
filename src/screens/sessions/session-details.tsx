import React, {useCallback, useEffect, useState} from 'react';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import {useCharging} from 'providers/apis/charging';

import DefaultHeader from 'components/headers/default-header';

import {ScrollView, StyleSheet, Text, View} from 'react-native';
import ScreenContainer from 'components/containers/screen-container';
import AnimatedCard from 'components/animated/animated-card';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {Spacer} from 'components/utils/spacer';
import {MappedSessionResponse} from 'providers/types/charging';
import {format} from 'date-fns';

type ListContentType = {
  iconName?: string;
  customIcon?: any;
  title: string;
  description: string;
}[];
interface SessionDetailProps {
  route?: {
    params?: {
      sessionID: number;
      chargepointID: string;
    };
  };
  testID?: string;
}

const SessionDetailsScreen = ({
  route,
  testID = 'SessionDetails',
}: SessionDetailProps) => {
  const {sessionID, chargepointID} = route?.params ?? {};
  const {
    dictionary: {
      SessionDetails: {ListContent},
      SessionDetails,
    },
  } = useDictionary();

  const {getChargingSessionById} = useCharging();
  const [session, setSession] = useState<MappedSessionResponse | undefined>();

  useEffect(() => {
    const fetchSession = async () => {
      const res = await getChargingSessionById({
        session_id: sessionID,
        chargepoint_id: chargepointID,
      });

      const {data} = res;

      setSession(data?.sessionData);
    };

    fetchSession();
  }, [chargepointID, getChargingSessionById, sessionID]);

  // ** ** ** ** ** STYLES ** ** ** ** **
  const {getWidth, getFontSize, getHeight} = useScale();
  const {coloursTheme, textStyles} = useStyle();
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: getWidth(20),
    },
    iconContainer: {
      width: getWidth(30),
      aspectRatio: 1,
      borderRadius: getWidth(30 / 2),
      backgroundColor: coloursTheme.tertiaryColor,
      marginRight: getWidth(10),
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      ...textStyles.regular16,
      width: getWidth(264),
    },
    titleText: {
      ...textStyles.semiBold16,
      width: getWidth(264),
    },
    row: {
      flexDirection: 'row',
    },
    alignCenter: {
      alignItems: 'center',
    },
  });

  const summaryListContent: ListContentType = [
    {
      iconName: 'calendar',
      title: session?.endDateTime
        ? format(new Date(session.endDateTime), 'dd.MM.yyyy')
        : '',
      description: ListContent.SessionDate,
    },
    {
      iconName: 'coins',
      title: `£${session?.total?.toFixed(2) || 0.0}`,
      description: ListContent.TotalCost,
    },
    {
      iconName: 'charging-station',
      title: chargepointID || 'N/A',
      description: ListContent.CPID,
    },
    {
      customIcon: session?.connector?.connector_type?.icon,
      title: session?.connector?.connector_type?.name || '',
      description: ListContent.ConnectorType,
    },
    {
      iconName: 'clock',
      title:
        session?.startDateTime && session?.endDateTime
          ? `${format(new Date(session?.startDateTime), 'HH:mm')} - ${format(
              new Date(session?.endDateTime),
              'HH:mm',
            )}`
          : '',
      description: ListContent.SessionLength,
    },
    {
      iconName: 'map-pin',
      title: session?.sessionSummary?.chargeStation?.site?.site_name || 'N/A',
      description: ListContent.SiteDetails,
    },
    {
      iconName: 'building',
      title:
        session?.sessionSummary?.chargeStation?.site?.whitelabel_domain ||
        'Other',
      description: ListContent.Provider,
    },
    {
      iconName: 'credit-card',
      title: session?.sessionSummary?.tarrif || 'N/A',
      description: ListContent.Tariff,
    },
  ];

  const paymentListContent: ListContentType = [
    {
      iconName: 'credit-card',
      title: session?.sessionSummary?.paymentType || 'N/A',
      description: ListContent.PaymentType,
    },
    {
      iconName: 'credit-card',
      title: session?.sessionSummary?.paymentMethod || 'N/A',
      description: ListContent.PaymentMethod,
    },
  ];

  const ContentRow = useCallback(
    ({iconName, customIcon, title, description}: any) => {
      const CustomIcon = customIcon;
      return (
        <View style={styles.row}>
          <View
            style={styles.iconContainer}
            testID={`${testID}.${description}Row.iconContainer`}>
            {CustomIcon ? (
              <CustomIcon
                size={getFontSize(30)}
                testID={`${testID}.${description}Row.customIcon`}
              />
            ) : (
              iconName && (
                <FontAwesome5Pro
                  name={iconName}
                  size={getFontSize(16)}
                  solid={false}
                  style={{
                    color: coloursTheme.primaryColor,
                  }}
                  testID={`${testID}.${description}Row.fontAwesomeIcon`}
                />
              )
            )}
          </View>
          <View>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.text}>{description}</Text>
          </View>
        </View>
      );
    },
    [
      coloursTheme.primaryColor,
      getFontSize,
      styles.iconContainer,
      styles.text,
      styles.titleText,
      testID,
      styles.row,
    ],
  );

  const SummaryListContent: React.FC<{list: ListContentType}> = useCallback(
    ({list}) => {
      return (
        <>
          {list.map(({iconName, customIcon, title, description}, index) => (
            <React.Fragment key={index}>
              <ContentRow
                iconName={iconName}
                title={title}
                description={description}
                customIcon={customIcon}
              />
              {index !== list.length - 1 && (
                <Spacer size={getHeight(15)} vertical />
              )}
            </React.Fragment>
          ))}
        </>
      );
    },
    [ContentRow, getHeight],
  );

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <>
      <DefaultHeader
        title="Session Details"
        // rightIcons={[
        //   {
        //     name: 'arrow-to-bottom',
        //     isPro: true,
        //   },
        // ]}
      />
      <ScreenContainer>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          <AnimatedCard
            title={SessionDetails.SessionSummary}
            animatedContent={<SummaryListContent list={summaryListContent} />}
            showMoreInfoText={false}
            isOpen
          />
          <Spacer size={getHeight(15)} vertical />
          <AnimatedCard
            title={SessionDetails.PaymentDetails}
            animatedContent={<SummaryListContent list={paymentListContent} />}
            showMoreInfoText={false}
            isOpen
          />
          <Spacer size={getHeight(50)} vertical />
        </ScrollView>
      </ScreenContainer>
    </>
  );
};

export default SessionDetailsScreen;
