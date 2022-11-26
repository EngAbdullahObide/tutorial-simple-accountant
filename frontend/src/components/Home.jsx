import React, { useRef, useState, useEffect } from "react";
import axios from '../config/axios';
import { WALLET_URL, Safe_URL, Expenses_URL } from "../config/urls";
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faMoneyBillWave, faVault, faGear, faTrash } from '@fortawesome/free-solid-svg-icons'
import './stylesComponents/home.css'

import moment from 'moment';

export default function Home() {
    let token = localStorage.getItem('accessToken');
    axios.defaults.headers.common = { 'Authorization': `JWT ${token}` };

    const history = useHistory();

  const redirect = () => {
    history.push('/sign');
  }
    if (!localStorage.getItem('accessToken')) {
        redirect()
    }

    //get date auto
    const currentDate = () => {
        var day = new Date().getDate();
        if (day < 10) {
            day = "0" + day;
        }
        var month = new Date().getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var year = new Date().getFullYear();
        return year + "/" + month + "/" + day;
    };

    //useState Hooks
    const [wallet, setWallet] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [safe, setSafe] = useState([]);
    const [userName, setUserName] = useState();

    const [addToWallet, setAddToWallet] = useState({
        name: '',
        quantity: '',
        date: currentDate(),
    });

    const [walletAlert, setWalletAlert] = useState({
        name: {
            isError: false,
            text: ''
        },
        quantity: {
            isError: false,
            text: ''
        },
        date: {
            isError: false,
            text: ''
        },
    });

    const [addToExpenses, setAddToExpenses] = useState({
        name: '',
        quantity: '',
        date: currentDate(),
    });

    const [expensesAlert, setExpensesAlert] = useState({
        name: {
            isError: false,
            text: ''
        },
        quantity: {
            isError: false,
            text: ''
        },
        date: {
            isError: false,
            text: ''
        },
    });

    const [addToSafe, setAddToSafe] = useState({
        name: '',
        quantity: '',
        date: currentDate(),
    });

    const [safeAlert, setSafeAlert] = useState({
        name: {
            isError: false,
            text: ''
        },
        quantity: {
            isError: false,
            text: ''
        },
        date: {
            isError: false,
            text: ''
        },
    });

    const [serverErrors, setServerErrors] = useState({
        walet: '',
        expenses: '',
        safe: ''
    });
   //Setting
    const [addCurrency, setAddCurrency] = useState('');
    const [selectedcurr, setSelectedcurr] = useState('$');
    const [currencys, setCurrencys] = useState(['$', 'IQ']);

    const [addWIncoming, setAddWIncoming] = useState('');
    const [walletIncoming, setWalletIncoming] = useState('');
    const [wIncomings, setWIncomings] = useState([]);

    const [addEIncoming, setAddEIncoming] = useState('');
    const [expensesIncoming, setExpensesIncoming] = useState('');
    const [eIncomings, setEIncomings] = useState([]);

    const [addSIncoming, setAddSIncoming] = useState('');
    const [safeIncoming, setSafeIncoming] = useState('');
    const [sIncomings, setSIncomings] = useState([]);

    const [showSett, setShowSett] = useState(false)
    const [showAddCurr, setShowAddCurr] = useState(false)
    const [showAddWIncoming, setShowAddWIncoming] = useState(false)
    const [showAddEIncoming, setShowAddEIncoming] = useState(false)
    const [showAddSIncoming, setShowAddSIncoming] = useState(false)

    //search bar
    const [searchInput, setSearchInput] = useState('');
    const [filteredWallet, setFilteredWallet] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [filteredSafe, setFilteredSafe] = useState([]);
    const [selectedDateFilter, setSelectedDateFilter] = useState('');


    //useEffect Hooks
    useEffect(() => {
        _getInfoByID();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            let errors = walletAlert;
            let sErrors = serverErrors;
            errors = { ...errors, name: { isError: false, text: '' } };
            errors = { ...errors, quantity: { isError: false, text: '' } };
            errors = { ...errors, date: { isError: false, text: '' } };
            sErrors = { ...sErrors, walet: '' };
            sErrors = { ...sErrors, expenses: '' };
            sErrors = { ...sErrors, safe: '' };
            setWalletAlert(errors);
            setExpensesAlert(errors);
            setSafeAlert(errors);
            setServerErrors(sErrors)
        }, 2500);
        return () => clearTimeout(timer);
    }, [walletAlert, expensesAlert, safeAlert]);

    //setting
    useEffect(() => {
        if (localStorage.getItem('+currencys')) {
            setCurrencys(JSON.parse(localStorage.getItem('+currencys')));
        };
        if (localStorage.getItem('used currency')) {
            setSelectedcurr(JSON.parse(localStorage.getItem('used currency')));
        };
        if (localStorage.getItem('+wIncomings')) {
            setWIncomings(JSON.parse(localStorage.getItem('+wIncomings')));
        };
        if (localStorage.getItem('+eIncomings')) {
            setEIncomings(JSON.parse(localStorage.getItem('+eIncomings')));
        };
        if (localStorage.getItem('+sIncomings')) {
            setSIncomings(JSON.parse(localStorage.getItem('+sIncomings')));
        };
    }, [])
    
    //search
    useEffect(() => {
        searchItems();
        dateFilter();
    }, [searchInput, selectedDateFilter]);

    //change coefficient

    const onChangeAddToWallet = (key, value) => {
        setAddToWallet({ ...addToWallet, [key]: value.target.value });
        setWalletAlert({ ...walletAlert, [key]: { isError: false } });

    };
    const onChangeAddToExpenses = (key, value) => {
        setAddToExpenses({ ...addToExpenses, [key]: value.target.value });
        setExpensesAlert({ ...expensesAlert, [key]: { isError: false } });
    };
    const onChangeAddToSafe = (key, value) => {
        setAddToSafe({ ...addToSafe, [key]: value.target.value });
        setSafeAlert({ ...safeAlert, [key]: { isError: false } });
    };



    //validate
    const walletValidate = () => {
        let errors = walletAlert
        let passed = true;

        if (!addToWallet.name) {
            errors = { ...errors, name: { isError: true, text: 'Name must be entered' } };
            passed = false;
        }

        if (!addToWallet.quantity) {
            errors = { ...errors, quantity: { isError: true, text: 'Quantity must be entered' } };
            passed = false;
        }
        if (!addToWallet.date) {
            errors = { ...errors, date: { isError: true, text: 'Date must be entered' } };
            passed = false;
        }
        setWalletAlert(errors);
        return passed;
    };

    const expensesValidate = () => {
        let errors = expensesAlert
        let passed = true;

        if (!addToExpenses.name) {
            errors = { ...errors, name: { isError: true, text: 'Name must be entered' } };
            passed = false;
        }

        if (!addToExpenses.quantity) {
            errors = { ...errors, quantity: { isError: true, text: 'Quantity must be entered' } };
            passed = false;
        }
        if (!addToExpenses.date) {
            errors = { ...errors, date: { isError: true, text: 'Date must be entered' } };
            passed = false;
        }
        setExpensesAlert(errors);
        return passed;
    };

    const safeValidate = () => {
        let errors = safeAlert
        let passed = true;

        if (!addToSafe.name) {
            errors = { ...errors, name: { isError: true, text: 'Name must be entered' } };
            passed = false;
        }

        if (!addToSafe.quantity) {
            errors = { ...errors, quantity: { isError: true, text: 'Quantity must be entered' } };
            passed = false;
        }
        if (!addToSafe.date) {
            errors = { ...errors, date: { isError: true, text: 'Date must be entered' } };
            passed = false;
        }
        setSafeAlert(errors);
        return passed;
    };


    //send info
    const _sendToWalet = () => {
        (async () => {
            if (!walletValidate()) return;
            const data = { ...addToWallet }
            sendWallet.current.classList.add("disabled");
            try {
                const response = await axios.post(WALLET_URL, data);
                setAddToWallet({
                    name: '',
                    quantity: '',
                    date: currentDate(),
                });
                showAll();
                sendWallet.current.classList.remove("disabled");
                _getInfoByID();
            } catch (e) {
                console.log(e);
                setServerErrors({ ...serverErrors, wallet: `Error: ${e.response.data.message}` });
                sendWallet.current.classList.remove("disabled");
            }
        })();
    };
    const _sendToExpenses = () => {
        (async () => {
            if (!expensesValidate()) return;
            const data = { ...addToExpenses }
            sendExpenses.current.classList.add("disabled");
            try {
                const response = await axios.post(Expenses_URL, data);
                setAddToExpenses({
                    name: '',
                    quantity: '',
                    date: currentDate(),
                });
                showAll();
                sendExpenses.current.classList.remove("disabled");
                _getInfoByID();
            } catch (e) {
                console.log(e);
                setServerErrors({ ...serverErrors, expenses: `Error: ${e.response.data.message}` });
                sendExpenses.current.classList.remove("disabled");
            }
        })();
    };
    const _sendToSafe = () => {
        (async () => {
            if (!safeValidate()) return;
            const data = { ...addToSafe }
            sendSafe.current.classList.add("disabled");
            try {
                const response = await axios.post(Safe_URL, data);
                setAddToSafe({
                    name: '',
                    quantity: '',
                    date: currentDate(),
                });
                showAll();
                sendSafe.current.classList.remove("disabled");
                _getInfoByID();
            } catch (e) {
                console.log(e);
                setServerErrors({ ...serverErrors, safe: `Error: ${e.response.data.message}` });
                sendSafe.current.classList.remove("disabled");
            }
        })();
    };


    //get info page
    const _getWalletInfo = () => {
        (async () => {
            try {
                const response = await axios.get(WALLET_URL);
                setWallet(response.data.reverse().sort((a,b) => new Date(b.date) - new Date(a.date)))
                setFilteredWallet(response.data);
                setSelectedDateFilter('')
            } catch (e) {
                console.log(e)
            }
        })();
    }

    const _getExpensesInfo = () => {
        (async () => {
            try {
                const response = await axios.get(Expenses_URL);
                setExpenses(response.data.reverse().sort((a,b) => new Date(b.date) - new Date(a.date)));
                setFilteredExpenses(response.data);
                setSelectedDateFilter('');
            } catch (e) {
                console.log(e)
            }
        })();
    }
    const _getSafeInfo = () => {
        (async () => {
            try {
                const response = await axios.get(Safe_URL);
                setSafe(response.data.reverse().sort((a,b) => new Date(b.date) - new Date(a.date)));
                setFilteredSafe(response.data);
                setSelectedDateFilter('');
            } catch (e) {
                console.log(e)
            }
        })();
    }

    const _getInfoByID = () => {
        (async () => {
            try {
                const response = await axios.get('account/me');
                _getWalletInfo();
                _getExpensesInfo();
                _getSafeInfo();
                setUserName(response.data.name);
            } catch (e) {
                console.log(e);
                setServerErrors({ ...serverErrors, wallet: `Error: ${e.response.data.message}` });
            }
        })();
    };

    //delete line

    const deleteWalletById = (id) => {
        (async () => {
            try {
                const response = await axios.delete(`${WALLET_URL}/${id}`);
                const updatedWallet = [...wallet];
                const line = updatedWallet.findIndex((line) => line.id === id);
                updatedWallet.splice(line, 1);
                setWallet(updatedWallet);
                const updatedfilter = [...filteredWallet];
                updatedfilter.splice(line, 1);
                setFilteredWallet(updatedfilter);
            } catch (e) {
                console.log(e);
                setServerErrors({ ...serverErrors, wallet: `Error: ${e.response.data.message}` });
            }
        })();
    }

    const deleteExpensesById = (id) => {
        (async () => {
            try {
                const response = await axios.delete(`${Expenses_URL}/${id}`);
                const updatedExpenses = [...expenses];
                const line = updatedExpenses.findIndex((line) => line.id === id);
                updatedExpenses.splice(line, 1);
                setExpenses(updatedExpenses);
                const updatedfilter = [...filteredExpenses];
                updatedfilter.splice(line, 1);
                setFilteredExpenses(updatedfilter);
            } catch (e) {
                console.log(e);
                setServerErrors({ ...serverErrors, expenses: `Error: ${e.response.data.message}` });
            }
        })();
    }

    const deleteSafeById = (id) => {
        (async () => {
            try {
                const response = await axios.delete(`${Safe_URL}/${id}`);
                const updatedSafe = [...safe];
                const line = updatedSafe.findIndex((line) => line.id === id);
                updatedSafe.splice(line, 1);
                setSafe(updatedSafe);
                const updatedfilter = [...filteredSafe];
                updatedfilter.splice(line, 1);
                setFilteredSafe(updatedfilter);
            } catch (e) {
                console.log(e);
                setServerErrors({ ...serverErrors, safe: `Error: ${e.response.data.message}` });
            }
        })();
    }


    //change style
    const icon1Ref = useRef(null);
    const icon2Ref = useRef(null);
    const icon3Ref = useRef(null);
    const table1Ref = useRef(null);
    const table2Ref = useRef(null);
    const table3Ref = useRef(null);
    const iconNameRef = useRef(null);
    const sendWallet = useRef(null);
    const sendExpenses = useRef(null);
    const sendSafe = useRef(null);

    const i1Click = (e) => {
        icon1Ref.current.classList.add("selectedIcon");
        icon2Ref.current.classList.remove("selectedIcon");
        icon3Ref.current.classList.remove("selectedIcon");
        table1Ref.current.classList.remove("hideItem");
        table2Ref.current.classList.add("hideItem");
        table3Ref.current.classList.add("hideItem");
    };
    const i2Click = (e) => {
        icon2Ref.current.classList.add("selectedIcon");
        icon1Ref.current.classList.remove("selectedIcon");
        icon3Ref.current.classList.remove("selectedIcon");
        table2Ref.current.classList.remove("hideItem");
        table1Ref.current.classList.add("hideItem");
        table3Ref.current.classList.add("hideItem");
    };
    const i3Click = (e) => {
        icon3Ref.current.classList.add("selectedIcon");
        icon2Ref.current.classList.remove("selectedIcon");
        icon1Ref.current.classList.remove("selectedIcon");
        table3Ref.current.classList.remove("hideItem");
        table2Ref.current.classList.add("hideItem");
        table1Ref.current.classList.add("hideItem");
    };
    const showAll = (e) => {
        icon3Ref.current.classList.remove("selectedIcon");
        icon2Ref.current.classList.remove("selectedIcon");
        icon1Ref.current.classList.remove("selectedIcon");
        table3Ref.current.classList.remove("hideItem");
        table2Ref.current.classList.remove("hideItem");
        table1Ref.current.classList.remove("hideItem");
        setShowAddCurr(false)
    };

    //Setting

    const onChangeCurrency = (value) => {
        setSelectedcurr(value.target.value);
        localStorage.setItem('used currency', JSON.stringify(value.target.value));
    }
    const onChangeWIncoming = (value) => {
        setWalletIncoming(value.target.value);
        setAddToWallet({ ...addToWallet, name: value.target.value });
    }
    const onChangeEIncoming = (value) => {
        setExpensesIncoming(value.target.value);
        setAddToExpenses({ ...addToExpenses, name: value.target.value });
    }
    const onChangeSIncoming = (value) => {
        setSafeIncoming(value.target.value);
        setAddToSafe({ ...addToSafe, name: value.target.value });
    }
    const onChangeAddCurrency = (value) => {
        setAddCurrency(value.target.value)
    }
    const onChangeAddWIncoming = (value) => {
        setAddWIncoming(value.target.value)
    }
    const onChangeAddEIncoming = (value) => {
        setAddEIncoming(value.target.value)
    }
    const onChangeAddSIncoming = (value) => {
        setAddSIncoming(value.target.value)
    }

    const addCurrencys = () => {
        if (!addCurrency) return;
        let array = [...currencys, addCurrency];
        setCurrencys(array);
        setAddCurrency('');
        localStorage.setItem('+currencys', JSON.stringify(array));
    }
    const addWIncomings = () => {
        if (!addWIncoming) return;
        let array = [...wIncomings, addWIncoming];
        setWIncomings(array);
        setAddWIncoming('');
        localStorage.setItem('+wIncomings', JSON.stringify(array));
    }
    const addEIncomings = () => {
        if (!addEIncoming) return;
        let array = [...eIncomings, addEIncoming];
        setEIncomings(array);
        setAddEIncoming('');
        localStorage.setItem('+eIncomings', JSON.stringify(array));
    }
    const addSIncomings = () => {
        if (!addSIncoming) return;
        let array = [...sIncomings, addSIncoming];
        setSIncomings(array);
        setAddSIncoming('');
        localStorage.setItem('+sIncomings', JSON.stringify(array));
    }

    const showSetting = (e) => {
        if (showSett) {
            iconNameRef.current.classList.add("nameIconOnClick");
            return (
                <section className="settingContainer">
                    <button onClick={logOut}>Logout</button>
                    <button onClick={() => setShowAddCurr(!showAddCurr)}>Add currency</button>
                    <button onClick={() => setShowAddWIncoming(!showAddWIncoming)}>Add <FontAwesomeIcon icon={faWallet} /> incoming</button>
                    <button onClick={() => setShowAddEIncoming(!showAddEIncoming)}>Add <FontAwesomeIcon icon={faMoneyBillWave} /> incoming</button>
                    <button onClick={() => setShowAddSIncoming(!showAddSIncoming)}>Add <FontAwesomeIcon icon={faVault} /> incoming</button>
                </section>
            )
        }
    };

    const logOut = () => {
        localStorage.removeItem('accessToken');
        window.location.reload();
    }

    const showAddCurrency = (e) => {
        if (showAddCurr) {
            iconNameRef.current.classList.add("nameIconOnClick");
            return (
                <section className="addCurrContainer">
                    <button onClick={addCurrencys}>Add currency</button>
                    <input type="text" onChange={onChangeAddCurrency} value={addCurrency} />
                </section>
            )
        }
    };
    const showAddwalletIncoming = (e) => {
        if (showAddWIncoming) {
            iconNameRef.current.classList.add("nameIconOnClick");
            return (
                <section className="addWIncomingContainer">
                    <button onClick={addWIncomings}>Add <FontAwesomeIcon icon={faWallet} /> incoming</button>
                    <input type="text" onChange={onChangeAddWIncoming} value={addWIncoming} />
                </section>
            )
        }
    };
    const showAddExpensesIncoming = (e) => {
        if (showAddEIncoming) {
            iconNameRef.current.classList.add("nameIconOnClick");
            return (
                <section className="addEIncomingContainer">
                    <button onClick={addEIncomings}>Add <FontAwesomeIcon icon={faMoneyBillWave} /> incoming</button>
                    <input type="text" onChange={onChangeAddEIncoming} value={addEIncoming} />
                </section>
            )
        }
    };
    const showAddSafeIncoming = (e) => {
        if (showAddSIncoming) {
            iconNameRef.current.classList.add("nameIconOnClick");
            return (
                <section className="addSIncomingContainer">
                    <button onClick={addSIncomings}>Add <FontAwesomeIcon icon={faVault} /> incoming</button>
                    <input type="text" onChange={onChangeAddSIncoming} value={addSIncoming} />
                </section>
            )
        }
    };

    const hiddSetting = () => {
        setShowSett(false);
        setShowAddCurr(false);
        setShowAddWIncoming(false);
        setShowAddEIncoming(false);
        setShowAddSIncoming(false);
        iconNameRef.current.classList.remove("nameIconOnClick");
    }

    //Search
    
    const onChangeDateFilter = (value) => {
        setSelectedDateFilter(value.target.value);
    }
    const dateFilter = () => {
       
        if(selectedDateFilter === 'Search' && searchInput === ''){
          setFilteredWallet(wallet);
          setFilteredExpenses(expenses);
          setFilteredSafe(safe);
        }
        if(selectedDateFilter === 'Current day'){
            let dateWallet = wallet.filter((item) => new Date(item.date) >  moment().startOf('day').subtract(1,'day'));
            let dateExpenses = expenses.filter((item) => new Date(item.date) >  moment().startOf('day').subtract(1,'day'));
            let dateSafe = safe.filter((item) => new Date(item.date) >  moment().startOf('day').subtract(1,'day'));
            setFilteredWallet(dateWallet);
            setFilteredExpenses(dateExpenses);
            setFilteredSafe(dateSafe);
            setSearchInput('');
           }
        if(selectedDateFilter === 'last week'){
            let dateWallet = wallet.filter((item) => new Date(item.date) >  moment().startOf('day').subtract(1,'week'));
            let dateExpenses = expenses.filter((item) => new Date(item.date) >  moment().startOf('day').subtract(1,'week'));
            let dateSafe = safe.filter((item) => new Date(item.date) >  moment().startOf('day').subtract(1,'week'));
            setFilteredWallet(dateWallet);
            setFilteredExpenses(dateExpenses);
            setFilteredSafe(dateSafe);
            setSearchInput('');
        }
        if(selectedDateFilter === 'last month'){
            let dateWallet = wallet.filter((item) => new Date(item.date) >  moment().startOf('day').subtract(1,'month'));
            let dateExpenses = expenses.filter((item) => new Date(item.date) >  moment().startOf('day').subtract(1,'month'));
            let dateSafe = safe.filter((item) => new Date(item.date) >  moment().startOf('day').subtract(1,'month'));
            setFilteredWallet(dateWallet);
            setFilteredExpenses(dateExpenses);
            setFilteredSafe(dateSafe);
            setSearchInput('');
        }
        if(selectedDateFilter === 'Current year'){
            let dateWallet = wallet.filter((item) => new Date(item.date) >  moment().startOf('day').subtract(1,'year'));
            let dateExpenses = expenses.filter((item) => new Date(item.date) >  moment().startOf('day').subtract(1,'year'));
            let dateSafe = safe.filter((item) => new Date(item.date) >  moment().startOf('day').subtract(1,'year'));
            setFilteredWallet(dateWallet);
            setFilteredExpenses(dateExpenses);
            setFilteredSafe(dateSafe);
            setSearchInput('');
        }
    }

    

    const searchItems = () => {
        if (searchInput !== '') {
            const filterWallet = wallet.filter((item) => {
                return (
                    item.name.toLowerCase().includes(searchInput.toLowerCase()) +
                    item.quantity.toLowerCase().includes(searchInput.toLowerCase()) +
                    item.date.toLowerCase().includes(searchInput.toLowerCase())
                )
            })
            setFilteredWallet(filterWallet);
            setSelectedDateFilter('');

            const filterExpenses = expenses.filter((item) => {
                return (
                    item.name.toLowerCase().includes(searchInput.toLowerCase()) +
                    item.quantity.toLowerCase().includes(searchInput.toLowerCase()) +
                    item.date.toLowerCase().includes(searchInput.toLowerCase())
                )
            })
            setFilteredExpenses(filterExpenses);

            const filterSafe = safe.filter((item) => {
                return (
                    item.name.toLowerCase().includes(searchInput.toLowerCase()) +
                    item.quantity.toLowerCase().includes(searchInput.toLowerCase()) +
                    item.date.toLowerCase().includes(searchInput.toLowerCase())
                )
            })
            setFilteredSafe(filterSafe);
        } else {
            setFilteredWallet(wallet);
            setFilteredExpenses(expenses);
            setFilteredSafe(safe);
        }
    }

    return (
        <div className="homeContainer">
            <header>
                <div><i ><FontAwesomeIcon ref={iconNameRef} className="nameIcon" icon={faGear} onClick={() => { setShowSett(!showSett); setShowAddCurr(false); iconNameRef.current.classList.remove("nameIconOnClick"); }} /> {userName}</i></div>
                 {showSetting()} {showAddCurrency()} {showAddwalletIncoming()} {showAddExpensesIncoming()} {showAddSafeIncoming()}
                <section className="details">
                    <input className="searchBar" placeholder="Search..." onClick={() => setSelectedDateFilter('Search')} onChange={(value) => setSearchInput(value.target.value)} />

                    <p>Pocket = {filteredWallet.reduce((prev, curr) => +prev + +curr.quantity, 0) - (filteredExpenses.reduce((prev, curr) => +prev + +curr.quantity, 0) + filteredSafe.reduce((prev, curr) => +prev + +curr.quantity, 0)) } {selectedcurr}</p>
                    <p>Wallet = {filteredWallet.reduce((prev, curr) => +prev + +curr.quantity, 0)} {selectedcurr}</p>
                    <p>Expenses = {filteredExpenses.reduce((prev, curr) => +prev + +curr.quantity, 0)} {selectedcurr}</p>
                    <p>Safe = {filteredSafe.reduce((prev, curr) => +prev + +curr.quantity, 0)} {selectedcurr}</p>

                    

                    <select className="selectedCurr" value={selectedcurr} onChange={onChangeCurrency}>
                        <option value={selectedcurr}>"{selectedcurr}"</option>
                        {currencys.map(item => (
                            <option value={item} >{item}</option>
                        ))}
                    </select>

                    <select className="selectedFilter" value={selectedDateFilter}  onChange={onChangeDateFilter}>
                        <option value={'Search'}>Search</option>
                        <option value={'Current day'}>Current day</option>
                        <option value={'last week'}>last week</option>
                        <option value={'last month'}>last month</option>
                        <option value={'Current year'}>Current year</option>
                    </select>
                    
                    <button onClick={showAll} >Home</button>
                </section>
            </header>

            <body onClick={hiddSetting}>
                <section className="homeInputsContainer">
                    <div>
                        <section className="inputName">
                            <p>Incoming name</p>
                            <input type="text" onChange={(text) => onChangeAddToWallet('name', text)} value={addToWallet.name} placeholder={walletAlert.name.text} />
                            <select value={walletIncoming} onChange={onChangeWIncoming}>
                                <option value={walletIncoming}>"{walletIncoming}"</option>
                                {wIncomings.map(item => (
                                    <option value={item} >{item}</option>
                                ))}
                            </select>
                        </section>
                        <section className="inputMoney">
                            <p>Incoming quantity</p>
                            <input type="number" onChange={(text) => onChangeAddToWallet('quantity', text)} value={addToWallet.quantity} placeholder={walletAlert.quantity.text} />
                            <h>{selectedcurr}</h>
                        </section>
                        <section>
                            <p>Added date</p>
                            <input type="text" onChange={(text) => onChangeAddToWallet('date', text)} value={addToWallet.date} placeholder={walletAlert.date.text} />
                        </section>
                        <button ref={sendWallet} onClick={() => _sendToWalet()}>Save</button>
                        <p className="signErrors">{serverErrors.wallet}</p>
                    </div>
                    <div>
                        <section className="inputName">
                            <p>Incoming name</p>
                            <input type="text" onChange={(text) => onChangeAddToExpenses('name', text)} value={addToExpenses.name} placeholder={expensesAlert.name.text} />
                            <select value={expensesIncoming} onChange={onChangeEIncoming}>
                                <option value={expensesIncoming}>"{expensesIncoming}"</option>
                                {eIncomings.map(item => (
                                    <option value={item} >{item}</option>
                                ))}
                            </select>
                        </section>
                        <section className="inputMoney">
                            <p>Incoming quantity</p>
                            <input type="number" onChange={(text) => onChangeAddToExpenses('quantity', text)} value={addToExpenses.quantity} placeholder={expensesAlert.quantity.text} />
                            <h>{selectedcurr}</h>
                        </section>
                        <section>
                            <p>Added date</p>
                            <input type="text" onChange={(text) => onChangeAddToExpenses('date', text)} value={addToExpenses.date} placeholder={expensesAlert.date.text} />
                        </section>
                        <button ref={sendExpenses} onClick={() => _sendToExpenses()}>Save</button>
                        <p className="signErrors">{serverErrors.expenses}</p>
                    </div>
                    <div>
                        <section className="inputName">
                            <p>Incoming name</p>
                            <input type="text" onChange={(text) => onChangeAddToSafe('name', text)} value={addToSafe.name} placeholder={safeAlert.name.text} />
                            <select value={safeIncoming} onChange={onChangeSIncoming}>
                                <option value={safeIncoming}>"{safeIncoming}"</option>
                                {sIncomings.map(item => (
                                    <option value={item} >{item}</option>
                                ))}
                            </select>
                        </section>
                        <section className="inputMoney">
                            <p>Incoming quantity</p>
                            <input type="number" onChange={(text) => onChangeAddToSafe('quantity', text)} value={addToSafe.quantity} placeholder={safeAlert.quantity.text} />
                            <h>{selectedcurr}</h>
                        </section>
                        <section>
                            <p>Added date</p>
                            <input type="text" onChange={(text) => onChangeAddToSafe('date', text)} value={addToSafe.date} placeholder={safeAlert.date.text} />
                        </section>
                        <button ref={sendSafe} onClick={() => _sendToSafe()}>Save</button>
                        <p className="signErrors">{serverErrors.safe}</p>
                    </div>
                </section>



                <section className="icons">
                    <i ref={icon1Ref} onClick={i1Click}><FontAwesomeIcon icon={faWallet} /></i>
                    <i ref={icon2Ref} onClick={i2Click}><FontAwesomeIcon icon={faMoneyBillWave} /></i>
                    <i ref={icon3Ref} onClick={i3Click}><FontAwesomeIcon icon={faVault} /></i>
                </section>
                <section className="tables">
                    <section ref={table1Ref}>
                        <div class="tb-header">
                            <table >
                                <thead>
                                    <tr>
                                        <th>wallet</th>
                                        <th>Price</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="tb-content">
                            {filteredWallet.map((wallet) => (
                                <table >
                                    <tbody>
                                        <tr className="tr" >
                                            <td>{wallet.name}</td>
                                            <td>{wallet.quantity} {selectedcurr}</td>
                                            <td >{wallet.date} <FontAwesomeIcon onClick={() => deleteWalletById(wallet.id)} id="deleteButton" className="deleteButton" icon={faTrash} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            ))}
                        </div>
                    </section>
                    <section ref={table2Ref} >
                        <div class="tb-header">
                            <table >
                                <thead>
                                    <tr>
                                        <th>Expenses</th>
                                        <th>Price</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="tb-content">
                            {filteredExpenses.map((expenses) => (
                                <table >
                                    <tbody>
                                        <tr className="tr">
                                            <td>{expenses.name}</td>
                                            <td>{expenses.quantity} {selectedcurr}</td>
                                            <td>{expenses.date}<FontAwesomeIcon onClick={() => deleteExpensesById(expenses.id)} id="deleteButton" className="deleteButton" icon={faTrash} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            ))}
                        </div>
                    </section>
                    <section ref={table3Ref}>
                        <div class="tb-header">
                            <table >
                                <thead>
                                    <tr>
                                        <th>safe</th>
                                        <th>Price</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="tb-content">
                            {filteredSafe.map((safe) => (
                                <table >
                                    <tbody>
                                        <tr className="tr">
                                            <td>{safe.name}</td>
                                            <td>{safe.quantity} {selectedcurr}</td>
                                            <td>{safe.date}<FontAwesomeIcon onClick={() => deleteSafeById(safe.id)} id="deleteButton" className="deleteButton" icon={faTrash} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            ))}
                        </div>
                    </section>
                </section>
            </body>
        </div>
    )
};