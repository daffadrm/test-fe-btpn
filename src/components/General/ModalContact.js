import { Button, Dialog, Grid, styled, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import Loading from './Loading';
import { Cancel, Send } from '@mui/icons-material';
import {
	useCreateContactMutation,
	useUpdateContactMutation,
} from 'src/services/contactApi';

// STYLED COMPONENTS
const DialogBox = styled('div')(() => ({
	width: 600,
	padding: '32px',
	textAlign: 'center',
	marginLeft: 'auto',
	marginRight: 'auto',
}));

const Title = styled('h4')(() => ({
	margin: 0,
	marginBottom: '8px',
	textTransform: 'capitalize',
}));

const FooterButton = styled('div')(() => ({
	margin: '8px',
	paddingTop: '8px',
	display: 'flex',
	justifyContent: 'space-between',
}));

const TextField = styled(TextValidator)(() => ({
	width: '100%',
	marginBottom: '16px',
}));

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

const ModalContact = ({
	open,
	onConfirmDialogClose,
	handleOpen,
	typeId,
	fetchData,
}) => {
	const [state, setState] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [changePhoto, setChangePhoto] = useState(null);

	const isEdit = typeId?.type === 'edit';
	const [updateContact] = useUpdateContactMutation();
	const [createContact] = useCreateContactMutation();

	const loadHandler = (loadValue) => {
		setIsLoading(loadValue);
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setChangePhoto(reader.result); // Perbarui state foto dengan URL data
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e) => {
		let payload;
		if (isEdit) {
			payload = {
				...state,
				age: Number(state.age),
			};
		} else {
			payload = {
				...state,
				age: Number(state.age),
				photo:
					'http://vignette1.wikia.nocookie.net/lotr/images/6/68/Bilbo_baggins.jpg/revision/latest?cb=20130202022550',
			};
		}
		e.preventDefault();
		console.log(state);

		if (state && state.firstName && state.lastName && state.age) {
			try {
				if (isEdit) {
					await updateContact({ body: payload, id: typeId.id });
					handleOpen('add', null);
					Swal.fire({
						position: 'center',
						icon: 'success',
						title: 'Data Berhasil disimpan',
						showConfirmButton: false,
						timer: 1500,
					});
					fetchData();
				} else {
					await createContact({ body: payload });
					handleOpen('add', null);
					Swal.fire({
						position: 'center',
						icon: 'success',
						title: 'Data Berhasil disimpan',
						showConfirmButton: false,
						timer: 1500,
					});
					fetchData();
				}
			} catch (error) {
				console.error('Error submitting the form:', error);
			}
		}
	};

	const handleChange = (event) => {
		event.persist();
		setState({ ...state, [event.target.name]: event.target.value });
	};

	useEffect(() => {
		if (typeId.type === 'edit') {
			setState({
				firstName: typeId?.firstName,
				lastName: typeId?.lastName,
				age: typeId?.age,
				photo: typeId?.photo,
			});
		}
	}, [typeId]);

	useEffect(() => {
		if (!open) {
			setState({});
		}
	}, [open]);

	const { firstName, lastName, age, photo } = state;
	return (
		<Dialog open={open} onClose={onConfirmDialogClose} handler={handleOpen}>
			<DialogBox>
				{isLoading ? (
					<Loading />
				) : (
					<>
						<Title>{typeId?.type} Contact</Title>
						<ValidatorForm onSubmit={handleSubmit} onError={() => null}>
							<Grid container>
								<Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
									<TextField
										type="text"
										name="firstName"
										id="standard-basic"
										value={firstName || ''}
										onChange={handleChange}
										errorMessages={['this field is required']}
										label="First Name"
										validators={[
											'required',
											'minStringLength: 4',
											'maxStringLength: 9',
										]}
									/>
									<TextField
										type="text"
										name="lastName"
										id="standard-basic"
										value={lastName || ''}
										onChange={handleChange}
										errorMessages={['this field is required']}
										label="Last Name"
										validators={[
											'required',
											'minStringLength: 4',
											'maxStringLength: 9',
										]}
									/>
									<TextField
										type="number"
										name="age"
										id="standard-basic"
										value={age || ''}
										onChange={handleChange}
										errorMessages={['this field is required']}
										label="Age"
										// validators={['required', 'maxStringLength: 9']}
										validators={[
											'minNumber: 0',
											'maxNumber: 100',
											// 'matchRegexp:^[0-9]$',
										]}
									/>
								</Grid>
								<Grid item lg={2} md={2} sm={2} xs={2} sx={{ mt: 2 }}>
									<img
										srcSet={`${photo}`}
										src={`${photo}`}
										alt={photo}
										loading="lazy"
										height={100}
										width={100}
									/>
								</Grid>
								<Grid item lg={6} md={6} sm={6} xs={6} sx={{ mt: 2 }}>
									<Button
										component="label"
										role={undefined}
										variant="contained"
										tabIndex={-1}
									>
										Upload Photo
										<VisuallyHiddenInput
											type="file"
											onChange={handleFileChange}
											accept="image/*"
											style={{ display: 'none' }}
										/>
									</Button>
								</Grid>
							</Grid>
							<FooterButton>
								<Button
									color="error"
									variant="outlined"
									onClick={onConfirmDialogClose}
								>
									<Cancel />
									<Typography sx={{ pl: 1, textTransform: 'capitalize' }}>
										Cancel
									</Typography>
								</Button>
								<Button
									color="primary"
									variant="outlined"
									type="submit"
									onClick={handleSubmit}
								>
									<Send />
									<Typography sx={{ pl: 1, textTransform: 'capitalize' }}>
										Submit
									</Typography>
								</Button>
							</FooterButton>
						</ValidatorForm>
					</>
				)}
			</DialogBox>
		</Dialog>
	);
};
export default ModalContact;
