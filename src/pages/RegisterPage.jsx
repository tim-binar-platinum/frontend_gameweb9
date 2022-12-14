import {Button, Container, Form, Label, Input, FormGroup} from "reactstrap"
import { useState, forwardRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import axios from "axios";
import { useForm } from "react-hook-form";
import { redirect } from "react-router-dom";

export default function Create () {
  const [formInput, setFormInput] = useState({
    email: '',
    name: '',
    username: '',
    confirm: '',
    password: '',
    birth_place: ''
  })
  const handleChange = ({ target: { name, value }}) => {
    setFormInput(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const { register, formState: {errors} } = useForm();

  const [gender, setGender] = useState('male')
  function handleSelect(e) {
    setGender((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

   const customDateInput = ({ value, onClick, onChange}, ref) => (
    <Input
      autoComplete="off"
      background="white"
      name='date'
      value={value}
      ref={ref}
      onClick={onClick}
      onChange={onChange}
    />
  );
  customDateInput.displayName = "DateInput";
  const CustomInput = forwardRef(customDateInput);

  const [startDate, setStartDate] = useState(new Date());

  const dateData = {
    birth_date: startDate
   }
  
  let genderData ={
    gender: gender.gender
  }

  const onSubmit = async (e) => {
   e.preventDefault()
   if (!formInput.name) {
    return alert("mohon isi name lengkap");
  }
   if (!formInput.username) {
    return alert("mohon isi username");
  }
   if (!formInput.password) {
    return alert("mohon isi password");
  }
  if (!formInput.email) {
    return alert("mohon isi email");
  }
   console.log(formInput, dateData, genderData)
  await axios.post('http://localhost:4000/register', 
      {
        email: formInput.email,
        name: formInput.name,
        username: formInput.username,
        password: formInput.password,
        dateData: dateData.birth_date,
        birth_place: formInput.birth_place, 
        gender: 'male'
      })
      .then(function (response) {
        const res = response.json()
        console.log(res.message)
        return alert('akun telah dibuat')
      })
      .catch(function (error) {
        console.log(error.message);
        return alert('username telah dipakai')
      });
  }
    
  return (
    <Container style={{paddingLeft:"10%", paddingRight:"10%"}} className="d-flex flex-column justify-content-center align-items-center">
      <Container className="d-flex justify-content-center h1 pb-3">REGISTER NEW PLAYER</Container>
      <Container style={{maxWidth: "500px"}} className="bg-light border p-5">
        <Form onChange={handleChange}>
        <FormGroup className="p-2">
            <Label>Full name</Label>
            <Input 
            {...register('name', {
              required: 'This is required',
            })}
            type='text' 
            placeholder="full name" 
            name="name" 
            value={formInput.name} 
            onChange={handleChange} 
            />
              {errors.email && errors.email.message}
          </FormGroup>
          <FormGroup className="p-2">
            <Label>Email</Label>
            <Input 
            {...register('email', {
              required: 'This is required',
              pattern: {value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address'}
            })}
            type='text' 
            placeholder="example@mail.com" 
            name="email" 
            value={formInput.email} 
            onChange={handleChange} 
            />
              {errors.email && errors.email.message}
          </FormGroup>
          <FormGroup className="p-2">
            <Label>Username</Label>
            <Input 
            {...register('Username', {
              required: 'This is required',
              minLength: { value: 4, message: 'Minimum length should be 4' },
            })}
            type='text' 
            placeholder="username" 
            name="username" 
            value={formInput.username} 
            onChange={handleChange} />
          </FormGroup>
          <FormGroup className="p-2">
            <Label>Password</Label>
            <Input
            {...register('Password', {
              required: 'This is required',
              // validate: {value:},
              minLength: { value: 4, message: 'Minimum length should be 4' },
            })} 
            type='password' 
            placeholder="password" 
            name="password" 
            value={formInput.password} 
            onChange={handleChange} 
            autoComplete="off"/>
              {errors.password && errors.password.message}
          </FormGroup>
          <FormGroup className="p-2">
            <Label>Gender</Label>
            <Input 
              type='select' 
              placeholder="gender" 
              name="select" 
              id="exampleSelect" 
              value={gender.gender}
              onChange={handleSelect} 
              >
                <option value={'male'}>male</option>
                <option value={'female'}>female</option>
            </Input>
          </FormGroup>
          <FormGroup className="p-2">
            <Label>Birth date</Label>
            <DatePicker
              name='date'
              selected={startDate} 
              onChange={(date) => setStartDate(date)} 
              customInput={<CustomInput />}
              />
          </FormGroup>
          <FormGroup className="p-2">
            <Label>Birth Place</Label>
            <Input 
            type='text' 
            placeholder="birth place" 
            name="birth_place" 
            value={formInput.birth_place} 
            onChange={handleChange}  />
          </FormGroup>
          <Container className="d-flex justify-content-center pt-4">
            <Button color="warning" type="submit" onClick={onSubmit}>Submit</Button>
          </Container>
        </Form>
      </Container>
    </Container>
  )
}
