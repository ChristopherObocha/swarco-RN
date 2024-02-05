import {FieldProps, Form} from 'components/utils/form';
import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import {useForm} from 'react-hook-form';
import {fields as exampleFields} from 'the-core-ui-module-tdforms-v2';

export default function ExampleFormsScreen(): JSX.Element {
  const {control} = useForm({mode: 'onChange', shouldFocusError: true});

  const fields: FieldProps[] = useMemo(() => {
    return exampleFields;
  }, []);

  const formHeader = useMemo(() => {
    return (
      <Text style={{textAlign: 'left', padding: 10, fontSize: 20}}>
        TDFormsV2 Custom Header
      </Text>
    );
  }, []);

  const formFooter = useMemo(() => {
    return (
      <Text
        style={{
          textAlign: 'left',
          padding: 10,
          fontSize: 20,
          marginBottom: 10,
        }}>
        TDFormsV2 Custom Footer
      </Text>
    );
  }, []);

  const formItemSeparator = useMemo(() => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: 'grey',
          opacity: 0.2,
          marginBottom: 10,
        }}
      />
    );
  }, []);

  return (
    <Form
      control={control}
      fields={fields}
      flatListProps={{
        scrollOnFocused: true,
        ListHeaderComponent: formHeader,
        ListFooterComponent: formFooter,
        contentContainerStyle: {
          padding: 10,
          backgroundColor: 'white',
        },
        ItemSeparatorComponent: () => formItemSeparator,
      }}
    />
  );
}
