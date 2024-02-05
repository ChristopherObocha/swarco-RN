/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Fri, 20th Oct 2023, 16:50:47 pm
 * Author: Christopher Obocha (chris.obocha@thedistance.co.uk)
 * Copyright (c) 2023 The Distance
 */

import React, {useCallback, useEffect, useState} from 'react';

import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';
import {useCharging} from 'providers/apis/charging';

import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import ModalContainer from 'components/containers/modal-container';
import {useDictionary} from 'providers/dictionary/dictionary-provider';
import AnimatedCard from 'components/animated/animated-card';
import {Text} from '@rneui/themed';
import {Spacer} from 'components/utils/spacer';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {
  ChargepointTariffData,
  ChargingSessionMappedResponse,
  SendInvoiceRequestParams,
} from 'providers/types/charging';
import {format} from 'date-fns';
import {
  convertPenceToPounds,
  convertSecondsToHoursMinutesSeconds,
} from 'utils/general-utils';
import CardContainer from 'components/cards/card-container';
import {getObject} from 'utils/storage-utils';
import {STORAGE} from 'utils/constants';
import {PrimaryButton} from 'components/buttons/primary-button';
import {usePayment} from 'providers/apis/payment';
import {useForm} from 'react-hook-form';
import {FIELD_TYPES, FieldProps, Form} from 'components/utils/form';
import {emailRegex} from 'utils/regex';
import {useAlert} from 'providers/alert/alert-provider';
import {LoadingView} from 'components/utils/loading-view';

interface Props {
  modalVisible: boolean;
  closeModal: () => void;
  chargepointID: string;
  sessionID: number;
  empID: string;
}

type ListContentType = {
  iconName?: string;
  customIcon?: any;
  title: string;
  description: string;
}[];

const ChargingCompleteModal = ({
  modalVisible,
  closeModal,
  chargepointID,
  sessionID,
  empID,
}: Props) => {
  const testID = 'ChargingCompleteModal';
  const {
    dictionary: {
      Errors,
      Charging: {Complete},
      Charging,
      SignIn,
    },
  } = useDictionary();
  const {getWidth, getFontSize, getHeight} = useScale();
  const {textStyles, coloursTheme} = useStyle();

  const {getChargepointTariff, getChargingSessionById} = useCharging();
  const {sendInvoice} = usePayment();

  const [chargingSession, setChargingSession] =
    useState<ChargingSessionMappedResponse | null>(null);
  const [chargePointTariff, setChargePointTariff] =
    useState<ChargepointTariffData | null>(null);

  useEffect(() => {
    if (modalVisible && sessionID && chargepointID) {
      getChargingSessionById({
        session_id: sessionID,
        chargepoint_id: chargepointID,
      }).then(response => {
        if (response.success && response.data) {
          setChargingSession(response.data);
        }
      });
    }
  }, [
    chargepointID,
    getChargingSessionById,
    modalVisible,
    sessionID,
    setChargingSession,
  ]);

  useEffect(() => {
    if (chargepointID) {
      getChargepointTariff({
        charging_point: chargepointID,
      }).then(response => {
        if (response.success && response.data) {
          setChargePointTariff(response.data.data || null);
        }
      });
    }
  }, [chargepointID, getChargepointTariff]);

  const {sessionData} = chargingSession || {};
  const {sessionSummary, startDateTime, endDateTime, connector} =
    sessionData || {};

  const {chargeStation, totalCost, totalEnergy, sessionLength, tarrif} =
    sessionSummary || {};

  const connectorName =
    typeof connector?.connector_type !== 'string'
      ? connector?.connector_type?.name
      : '';
  const connectorIcon =
    typeof connector?.connector_type !== 'string'
      ? connector?.connector_type?.icon
      : '' ||
        require('../../../assets/svg/connector-types/other-connectors.svg')
          .default;
  const {hours, minutes} = convertSecondsToHoursMinutesSeconds(
    sessionLength || 0,
  );

  const summaryListInitialContent: ListContentType = [
    {
      iconName: 'charging-station',
      title: chargeStation?.display_name || 'N/A',
      description: Charging.Complete.CPID,
    },
    {
      iconName: 'clock',
      title: `${hours}h ${minutes}m`,
      description: Charging.Complete.TotalSessionTime,
    },
    {
      iconName: 'coins',
      title: `£${totalCost || '0.00'}`,
      description: Charging.Complete.TotalCost,
    },
    {
      iconName: 'bolt',
      title: `${totalEnergy || '0.00'} kWh`,
      description: Charging.Complete.TotalSessionEnergy,
    },
    {
      iconName: 'plug',
      title: `£${
        convertPenceToPounds(chargePointTariff?.dc_price || 0).toFixed(2) ||
        '0.00'
      }`,
      description: Charging.Complete.PricePerKwh,
    },
  ];

  const {site} = chargeStation || {};
  const address = site?.site_address_address_line1
    ? `${site?.site_address_address_line1 || ''} ${
        site?.site_address_locality || ''
      } ${site?.site_address_postal_code || ''}`
    : 'N/A';

  const summaryListAnimatedContent: ListContentType = [
    {
      iconName: 'calendar',
      title: startDateTime ? format(startDateTime, 'dd.MM.yyyy') : 'N/A',
      description: Charging.Complete.SessionDate,
    },
    {
      iconName: 'map-pin',
      title: address,
      description: Charging.Complete.SiteDetails,
    },
    {
      iconName: 'clock',
      title:
        startDateTime && endDateTime
          ? `${format(startDateTime, 'HH:mm')} - ${format(
              endDateTime,
              'HH:mm',
            )}`
          : 'N/A',
      description: Charging.Complete.SessionLength,
    },
    {
      customIcon: connectorIcon,
      title: connectorName || 'N/A',
      description: Charging.Complete.ConnectorType,
    },
    {
      iconName: 'credit-card',
      title: tarrif || 'N/A',
      description: Charging.Complete.Tariff,
    },
  ];

  const initialList: ListContentType = getObject(STORAGE.GUEST_TOKEN)
    ? summaryListInitialContent
    : summaryListInitialContent.concat(summaryListAnimatedContent); //show the whole list at once for signed in users

  // ** ** ** ** ** STYLES ** ** ** ** **
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: getWidth(20),
      width: getWidth(375),
      flex: 1,
    },
    text: {
      ...textStyles.regular16,
      width: getWidth(264),
    },
    titleText: {
      ...textStyles.semiBold16,
      width: getWidth(264),
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
    emailInvoiceButton: {
      alignSelf: 'center',
      paddingHorizontal: getWidth(10),
    },
    form: {
      paddingTop: getHeight(15),
      paddingBottom: Platform.select({
        ios: getHeight(12.5),
        android: getHeight(7.5),
      }),
    },
    invoiceCard: {
      marginBottom: getHeight(15),
      paddingBottom: getHeight(25),
    },
    invoiceDescription: {
      ...textStyles.regular16,
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **

  const ContentRow = useCallback(
    ({iconName, customIcon, title, description}: any) => {
      const CustomIcon = customIcon;
      return (
        <View style={{flexDirection: 'row'}}>
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
    [ContentRow, summaryListInitialContent.length, getHeight],
  );

  const {
    control,
    formState: {isValid},
    handleSubmit,
  } = useForm({mode: 'onChange'});

  const [loading, setLoading] = useState(false);
  const {alert} = useAlert();

  const onSubmit = handleSubmit(async data => {
    setLoading(true);
    const {email} = data;

    const params: SendInvoiceRequestParams = {
      email: email,
      emp_session_id: empID,
    };
    console.log('params: ', params);

    const response = await sendInvoice(params);
    console.log('response: ', response);

    if (
      response.success &&
      (response.data?.status || response.data?.status_code)
    ) {
      alert(Complete.InvoiceSent);
    } else {
      alert(
        Errors.ChargingAuth.Title,
        response.data?.message || response.error?.message,
      );
    }
    setLoading(false);
  });

  const fields: FieldProps[] = [
    {
      type: FIELD_TYPES.EMAIL,
      name: 'email',
      label: SignIn.EmailAddress,
      placeholder: SignIn.EmailAddressPlaceholder,
      autoCapitalize: 'none',
      rules: {
        required: SignIn.EmailRequired,
        pattern: {
          value: emailRegex,
          message: SignIn.EmailInvalid,
        },
      },
      defaultValue: '',
      caretHidden: false,
    },
  ];

  return (
    <ModalContainer
      title={Complete.Title}
      modalVisible={modalVisible}
      closeModal={closeModal}
      backgroundColor={coloursTheme.backgroundColor}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {!!getObject(STORAGE.GUEST_TOKEN) && (
            <CardContainer style={styles.invoiceCard}>
              <Text style={styles.invoiceDescription}>
                {Complete.SendInvoiceDescription}
              </Text>
              <Form
                control={control}
                fields={fields}
                flatListProps={{
                  contentContainerStyle: styles.form,
                  scrollEnabled: false,
                }}
              />
              <PrimaryButton
                containerStyle={styles.emailInvoiceButton}
                title={Complete.SendInvoiceButton}
                disabled={!isValid}
                onPress={onSubmit}
              />
            </CardContainer>
          )}
          <AnimatedCard
            title={Complete.SessionSummary}
            showMoreInfoText={false}
            initialContent={
              <View>
                <SummaryListContent list={initialList} />
              </View>
            }
            animatedContent={
              <View>
                <Spacer size={getHeight(15)} vertical />
                <SummaryListContent list={summaryListAnimatedContent} />
              </View>
            }
            hideExpandButton={!getObject(STORAGE.GUEST_TOKEN)}
          />
          <Spacer vertical size={100} />
        </ScrollView>
      </View>
      {loading && LoadingView()}
    </ModalContainer>
  );
};

export default ChargingCompleteModal;
