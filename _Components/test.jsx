const [profile, setProfile] = useState({});
const [selectedImage, setSelectedImage] = useState(null);
const [hasCustomImage, setHasCustomImage] = useState(false);
const [profileImageFile, setProfileImageFile] = useState(null);
const [formData, setFormData] = useState({
  newPassword: "",
  confirmNewPassword: "",
});
const [error, setError] = useState(null);
const router = useRouter();

useEffect(() => {
  ManageUser.getProfileData(localStorage.getItem("Email"), (data) => {
    setProfile(data);
    if (data.profileImage) {
      setSelectedImage(data.profileImage);
      setHasCustomImage(true);
    } else {
      setSelectedImage(null);
      setHasCustomImage(false);
    }
  });
}, []);

useEffect(() => {
  console.log("Something has changed...");
}, [profile]);

const handleImageChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    setProfileImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
      // Update profile object
      // setProfile((prevProfile) => ({
      //   ...prevProfile,
      //   profileImage: e.target.result,
      // }));
      setHasCustomImage(true);
    };
    reader.readAsDataURL(file);
  }
};

const handleRemoveImage = () => {
  const confirmed = window.confirm(
    "Are you sure you want to remove your profile picture?"
  );
  if (confirmed) {
    setSelectedImage(null);
    setProfile((prevProfile) => ({
      ...prevProfile,
      profileImage: null,
    }));
    setHasCustomImage(false);
  }
};

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
  // const success = await ManageUser.editProfileData(profile.id, profile);
  // if (success) {
  //   ManageUser.getProfileData(profile.Email, (data) => {
  //     setProfile(data);
  //     if (data.profileImage) {
  //       setSelectedImage(data.profileImage);
  //       setHasCustomImage(true);
  //     } else {
  //       setSelectedImage(null);
  //       setHasCustomImage(false);
  //     }
  //   });
  // }

  ManageUser.setProfileImage(profileImageFile);
};
