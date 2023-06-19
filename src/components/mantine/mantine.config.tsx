import { ContextStylesParams, MantineProvider, MantineTheme } from '@mantine/core';

interface Props {
  children: React.ReactNode;
}

export function Theme({ children }: Props): React.JSX.Element {
  const myTheme = {
    components: {
      Button: {
        classNames: { root: 'button-root', label: 'button-label' },
      },
      TextInput: {
        defaultProps: {
          size: 'lg',
        },
        styles: (theme: MantineTheme, params: any, context: ContextStylesParams) => ({
          input: {
            ...(context.size === 'xs' && { height: '24px', minHeight: '24px', padding: '0 4px', fontSize: '10px !important', lineHeight: '10px' }),
            ...(context.size === 'sm' && { height: '32px', minHeight: '32px', padding: '0 6px', fontSize: '12px !important', lineHeight: '16px' }),
            ...(context.size === 'md' && { height: '36px', minHeight: '36px', padding: '0 8px', fontSize: '12px !important', lineHeight: '18px' }),
            ...(context.size === 'lg' && { height: '40px', minHeight: '40px', padding: '0 12px', fontSize: '14px !important', lineHeight: '20px' }),
            ...(context.size === 'xl' && { height: '48px', minHeight: '48px', padding: '0 16px', fontSize: '16px !important', lineHeight: '22px' }),
          },
        }),
      },
      Select: {
        defaultProps: {
          size: 'sm',
        },
        styles: (theme: MantineTheme, params: any, context: ContextStylesParams) => ({
          input: {
            ...(context.size === 'sm' && { height: '40px', minHeight: '40px', padding: '0 12px', fontSize: '14px !important', lineHeight: '20px' }),
          },
        }),
      },
      PasswordInput: {
        defaultProps: {
          size: 'lg',
        },
        styles: (theme: MantineTheme, params: any, context: ContextStylesParams) => ({
          innerInput: {
            ...(context.size === 'xs' && { height: '24px', minHeight: '24px', padding: '0 4px', fontSize: '10px !important', lineHeight: '10px' }),
            ...(context.size === 'sm' && { height: '32px', minHeight: '32px', padding: '0 6px', fontSize: '12px !important', lineHeight: '16px' }),
            ...(context.size === 'md' && { height: '36px', minHeight: '36px', padding: '0 8px', fontSize: '12px !important', lineHeight: '18px' }),
            ...(context.size === 'lg' && { height: '40px', minHeight: '40px', padding: '0 12px', fontSize: '14px !important', lineHeight: '20px' }),
            ...(context.size === 'xl' && { height: '48px', minHeight: '48px', padding: '0 16px', fontSize: '16px !important', lineHeight: '22px' }),
          },
          input: {
            ...(context.size === 'xs' && { height: '24px', minHeight: '24px' }),
            ...(context.size === 'sm' && { height: '32px', minHeight: '32px' }),
            ...(context.size === 'md' && { height: '36px', minHeight: '36px' }),
            ...(context.size === 'lg' && { height: '40px', minHeight: '40px' }),
            ...(context.size === 'xl' && { height: '48px', minHeight: '48px' }),
          },
        }),
      },
    },
    colors: {
      light: ['rgba(255, 255, 255, 10%)', 'rgba(255, 255, 255, 20%)', 'rgba(255, 255, 255, 30%)', 'rgba(255, 255, 255, 40%)', 'rgba(255, 255, 255, 100%)', 'rgba(255, 255, 255, 60%)', 'rgba(255, 255, 255, 70%)', 'rgba(255, 255, 255, 80%)', 'rgba(255, 255, 255, 90%)'],
      brand: ['#D4E1FA', '#A9C3F4', '#7EA5EF', '#5387E9', '#2869E4', '#2054B6', '#183F89', '#102A5B', '#08152E'],
      primary: ['#d0e6ff', '#a2cdff', '#73b3ff', '#459aff', '#1681ff', '#1267cc', '#0d4d99', '#093466', '#041a33'],
      secondary: ['#e0e2e4', '#c2c6ca', '#a3a9af', '#858d95', '#66707a', '#525a62', '#3d4349', '#292d31', '#141618'],
      info: ['#ccf0ff', '#99e1ff', '#66d1ff', '#33c2ff', '#00b3ff', '#008fcc', '#006b99', '#004866', '#002433'],
      danger: ['#ffdfde', '#ffbfbd', '#ff9e9d', '#ff7e7c', '#ff5e5b', '#cc4b49', '#993837', '#662624', '#331312'],
      success: ['#cdf7ec', '#9befd9', '#6ae6c6', '#38deb3', '#06d6a0', '#05ab80', '#048060', '#025640', '#012b20'],
      warning: ['#fcf5d5', '#f8ebaa', '#f5e180', '#f1d755', '#eecd2b', '#bea422', '#8f7b1a', '#5f5211', '#302909'],
    },
  };

  return (
    <MantineProvider theme={myTheme as any} withCSSVariables withGlobalStyles withNormalizeCSS>
      {/*
        <div>
          <Button color="warning.4">Move focus with tab</Button>
          <TextInput label="Input label" description="Input description" />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
          <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
        </div>
        */}
      {children}
    </MantineProvider>
  );
}
