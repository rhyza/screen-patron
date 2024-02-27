import { useState } from 'react';
import { Form } from '@remix-run/react';
import { Button, Input, Modal, ModalBody, ModalContent, RadioGroup } from '@nextui-org/react';
import { RadioIcon } from './RadioIcon';

export default function RSVPModal({...props}) {
  const { selected, ...modalProps } = props;
  const [rsvp, setRsvp] = useState(selected);
  const handlePress = (value: string) => {
    setRsvp(() => value);
  }

  return (
    <Modal  hideCloseButton {...modalProps}>
      <ModalContent >
        {(onClose) => (
          <ModalBody className='p-6'>
            <Form className='flex flex-wrap justify-center gap-6'>
              <RadioGroup
                className='p-6'
                defaultValue={selected}
                isRequired
                name='rsvp'
                orientation='horizontal'
              >
                <RadioIcon description='Going' size='lg' value='going'>
                  👍
                </RadioIcon>
                <RadioIcon description='Maybe' size='lg' value='maybe'>
                  🤔
                </RadioIcon>
                <RadioIcon description='Not Going' size='lg' value='not going'>
                  👎
                </RadioIcon>
              </RadioGroup>
              <Input
                label='Your Name'
                name='name'
                radius='none'
                size='lg'
                type='text'
              />
              <div className='flex justify-center'>
                <Button className='w-32 bg-primary' radius='none' type='submit'>Save</Button>
                <Button className='w-32' onClick={onClose} radius='none'>Cancel</Button>
              </div>
            </Form>
            
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}