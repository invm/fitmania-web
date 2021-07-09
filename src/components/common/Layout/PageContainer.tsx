import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '10px',
    marginBottom: '10px',
    minHeight: '1px',
    height: '100%',
    [theme.breakpoints.down('xs')]: {
      padding: 0,
    },
  },
}));

const PageContainer = ({ children }: { children: any | any[] }) => {
  const classes = useStyles();

  return (
    <Container className={[classes.root, 'fade'].join(' ')}>
      {children}
    </Container>
  );
};

export default PageContainer;
