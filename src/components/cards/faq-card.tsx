/*
 * Jira Ticket:
 * Zeplin Design:
 * Feature Document:
 * Created Date: Tue, 9th Jan 2024, 10:15:27 am
 * Author: Nawaf Ibrahim (nawaf.ibrahim@thedistance.co.uk)
 * Copyright (c) 2024 The Distance
 */

import React from 'react';

import {useStyle} from 'providers/style/style-provider';

import {Text, StyleSheet} from 'react-native';
import AnimatedCard from 'components/animated/animated-card';

interface FAQCardProps {
  question: string;
  answer: string;
  testID: string;
}
const FAQCard = ({
  question = '',
  answer = '',
  testID = 'FAQCard',
}: FAQCardProps) => {
  // ** ** ** ** ** STYLES ** ** ** ** **
  const {textStyles} = useStyle();

  const styles = StyleSheet.create({
    answerText: {
      ...textStyles.regular16,
      letterSpacing: -0.7,
    },
  });

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <AnimatedCard
      testID={testID}
      showMoreInfoText={false}
      title={question}
      animatedContent={<Text style={styles.answerText}>{answer}</Text>}
    />
  );
};

export default FAQCard;
