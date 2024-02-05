import React from 'react';
import {useScale} from 'providers/style/scale-provider';
import {useStyle} from 'providers/style/style-provider';

import {Icon, IconProps} from '@rneui/themed';

const socialIcons = {
  twitter: 'twitter-square',
  facebook: 'facebook-square',
  linkedin: 'linkedin',
  youtube: 'youtube-square',
  instagram: 'instagram-square',
  share: 'share-square',
};

export type SocialIconName = keyof typeof socialIcons;

type ReactNativeIconProps = Omit<IconProps, 'name'>;

interface SocialButtonProps extends ReactNativeIconProps {
  name?: SocialIconName;
}

const SocialButton = ({
  name = 'share',
  onPress,
  testID = 'SocialButton',
  ...props
}: SocialButtonProps) => {
  const {getFontSize} = useScale();
  const {coloursTheme} = useStyle();

  // ** ** ** ** ** RENDER ** ** ** ** **
  return (
    <Icon
      {...props}
      name={socialIcons[name]}
      type="font-awesome-5"
      color={coloursTheme.button.icon.social.color}
      onPress={onPress}
      testID={testID}
      size={getFontSize(35)}
    />
  );
};

export default SocialButton;
