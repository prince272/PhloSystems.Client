import { IconButton } from '@mui/material';
import * as Icons from '@mui/icons-material';
import PropTypes from 'prop-types';

const DialogCloseButton = (props) => {
    const { children, onClose, ...other } = props;
    return (
        <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
                position: 'absolute',
                right: 8,
                top: 8
            }} {...other}
        >
            <Icons.Close />
        </IconButton>
    )
};

DialogCloseButton.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export { default as PasswordField } from './PasswordField';
export { default as PhoneTextField } from './PhoneTextField';

export { default as ViewContext } from './ViewContext';
export * from './ViewContext';
export { DialogCloseButton };

export { default as ClientContext } from './ClientContext';
export * from './ClientContext';

export { default as FileUploader } from './FileUploader';
export * from './FileUploader'; 