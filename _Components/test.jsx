const [profile, setProfile] = useState({});
const [formData, setFormData] = useState({
  newPassword: "",
  confirmNewPassword: "",
});
const [error, setError] = useState(null);
const router = useRouter();

const [selectedInterests, setSelectedInterests] = useState([]);

useEffect(() => {
  ManageUser.getProfileData(localStorage.getItem("Email"), setProfile);
}, []);

useEffect(() => {
  // ManageUser.getProfileData(localStorage.getItem("Email"), setProfile);

  console.log("My Interests: ", profile.Interests);
  setSelectedInterests(profile.Interests);
}, [profile]);

const handleProfileChange = (e) => {
  const { name, value } = e.target;
  setProfile((prevProfile) => ({
    ...prevProfile,
    [name]: value,
  }));
};

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

const handleEditProfileSubmit = async (e) => {
  e.preventDefault();
  const success = await ManageUser.editProfileData(
    profile.id,
    profile,
    selectedInterests
  );
  if (success) {
    ManageUser.getProfileData(profile.Email, setProfile);
  }
};
