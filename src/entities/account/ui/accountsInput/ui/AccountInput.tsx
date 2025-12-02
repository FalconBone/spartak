import { useState, useRef } from 'react';
import { Input, Tag, Spin, Space, Button, notification, type NotificationArgsProps } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useClickAway } from 'ahooks';
import { useLazyCheckAccountQuery } from '@entities/account/api/api';
import classes from './AccountInput.module.scss'

interface AccountInputProps {
  placeholder?: string;
  partner_id: number,
  disabled?: boolean,
  accounts: string[],
  setAccounts: Function
}

export const AccountInput: React.FC<AccountInputProps> = ({ placeholder = 'Введите ID аккаунта', partner_id, disabled = false, setAccounts, accounts }) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(() => setIsOpen(false), ref);

  const [trigger, { isFetching }] = useLazyCheckAccountQuery();

  const handleAdd = async () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    try {
      await trigger({ partner_id, fb_account_id: trimmedValue }).unwrap();
      if (!accounts.includes(trimmedValue)) {
        setAccounts([...accounts, trimmedValue]);
      }
      setInputValue('');
    } catch (error) {
      // Тут можно добавить уведомление об ошибке
      notification.error({
        message: `Ошибка поиска аккаунта`,
        description: `Аккаунт ${trimmedValue} не найден у партнера`,
        placement: 'topRight'
      });
      console.error('Ошибка проверки аккаунта', error);
    }
  };

  const handleRemove = (id: string) => {
    setAccounts(accounts.filter((acc) => acc !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div ref={ref}>
      <div className={classes.input_block}>
        <Input
          disabled={disabled}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          suffix={isFetching ? <Spin size="small" /> : null}
          className={classes.input}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={handleAdd} disabled={disabled}>+</Button>
      </div>
      <div className={classes.accounts}>
        <Space wrap>
          {accounts.map((id) => (
            <Tag
              key={id}
              closable
              onClose={() => handleRemove(id)}
              closeIcon={<CloseCircleOutlined />}
            >
              {id}
            </Tag>
          ))}
        </Space>
      </div>
    </div>
  );
};

export default AccountInput;
