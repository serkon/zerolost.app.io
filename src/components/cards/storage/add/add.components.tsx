import { Button, Dialog, Group, Modal, Text, TextInput } from '@mantine/core';
import { useCallback } from 'react';
import { useTranslate } from 'src/components/translate/translate.component';

interface StorageAddProps {
  opened: boolean;
  closed: () => void;
}

export const StorageAdd = ({ opened, closed }: StorageAddProps): React.ReactElement => {
  const { translate } = useTranslate();
  const onClickHandler = useCallback((): void => {
    console.log('sad');
  }, []);

  return (
    <>
      <Dialog opened={opened} withCloseButton onClose={closed} size="lg" radius="md">
        <Text size="sm" mb="xs" weight={500}>
          Subscribe to email newsletter
        </Text>

        <Group align="flex-end">
          <TextInput placeholder="hello@gluesticker.com" sx={{ flex: 1 }} />
          <Button onClick={closed}>Subscribe</Button>
        </Group>
      </Dialog>

      <Modal opened={opened} onClose={closed} title="Authentication" centered>
        {/* Modal content */}
      </Modal>
    </>
  );
};
