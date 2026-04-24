/****************************************************************************
** Meta object code from reading C++ file 'spellshell.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.13)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "../../../../showeq-daemon/src/spellshell.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'spellshell.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.13. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_SpellShell_t {
    QByteArrayData data[25];
    char stringdata0[256];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_SpellShell_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_SpellShell_t qt_meta_stringdata_SpellShell = {
    {
QT_MOC_LITERAL(0, 0, 10), // "SpellShell"
QT_MOC_LITERAL(1, 11, 8), // "addSpell"
QT_MOC_LITERAL(2, 20, 0), // ""
QT_MOC_LITERAL(3, 21, 16), // "const SpellItem*"
QT_MOC_LITERAL(4, 38, 8), // "delSpell"
QT_MOC_LITERAL(5, 47, 11), // "changeSpell"
QT_MOC_LITERAL(6, 59, 11), // "clearSpells"
QT_MOC_LITERAL(7, 71, 5), // "clear"
QT_MOC_LITERAL(8, 77, 18), // "selfStartSpellCast"
QT_MOC_LITERAL(9, 96, 14), // "const uint8_t*"
QT_MOC_LITERAL(10, 111, 8), // "buffLoad"
QT_MOC_LITERAL(11, 120, 16), // "const spellBuff*"
QT_MOC_LITERAL(12, 137, 4), // "buff"
QT_MOC_LITERAL(13, 142, 6), // "size_t"
QT_MOC_LITERAL(14, 149, 7), // "uint8_t"
QT_MOC_LITERAL(15, 157, 6), // "action"
QT_MOC_LITERAL(16, 164, 13), // "simpleMessage"
QT_MOC_LITERAL(17, 178, 4), // "cmsg"
QT_MOC_LITERAL(18, 183, 12), // "spellMessage"
QT_MOC_LITERAL(19, 196, 8), // "QString&"
QT_MOC_LITERAL(20, 205, 11), // "zoneChanged"
QT_MOC_LITERAL(21, 217, 9), // "killSpawn"
QT_MOC_LITERAL(22, 227, 11), // "const Item*"
QT_MOC_LITERAL(23, 239, 8), // "deceased"
QT_MOC_LITERAL(24, 248, 7) // "timeout"

    },
    "SpellShell\0addSpell\0\0const SpellItem*\0"
    "delSpell\0changeSpell\0clearSpells\0clear\0"
    "selfStartSpellCast\0const uint8_t*\0"
    "buffLoad\0const spellBuff*\0buff\0size_t\0"
    "uint8_t\0action\0simpleMessage\0cmsg\0"
    "spellMessage\0QString&\0zoneChanged\0"
    "killSpawn\0const Item*\0deceased\0timeout"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_SpellShell[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
      14,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       4,       // signalCount

 // signals: name, argc, parameters, tag, flags
       1,    1,   84,    2, 0x06 /* Public */,
       4,    1,   87,    2, 0x06 /* Public */,
       5,    1,   90,    2, 0x06 /* Public */,
       6,    0,   93,    2, 0x06 /* Public */,

 // slots: name, argc, parameters, tag, flags
       7,    0,   94,    2, 0x0a /* Public */,
       8,    1,   95,    2, 0x0a /* Public */,
      10,    1,   98,    2, 0x0a /* Public */,
      12,    3,  101,    2, 0x0a /* Public */,
      15,    3,  108,    2, 0x0a /* Public */,
      16,    3,  115,    2, 0x0a /* Public */,
      18,    1,  122,    2, 0x0a /* Public */,
      20,    0,  125,    2, 0x0a /* Public */,
      21,    1,  126,    2, 0x0a /* Public */,
      24,    0,  129,    2, 0x0a /* Public */,

 // signals: parameters
    QMetaType::Void, 0x80000000 | 3,    2,
    QMetaType::Void, 0x80000000 | 3,    2,
    QMetaType::Void, 0x80000000 | 3,    2,
    QMetaType::Void,

 // slots: parameters
    QMetaType::Void,
    QMetaType::Void, 0x80000000 | 9,    2,
    QMetaType::Void, 0x80000000 | 11,    2,
    QMetaType::Void, 0x80000000 | 9, 0x80000000 | 13, 0x80000000 | 14,    2,    2,    2,
    QMetaType::Void, 0x80000000 | 9, 0x80000000 | 13, 0x80000000 | 14,    2,    2,    2,
    QMetaType::Void, 0x80000000 | 9, 0x80000000 | 13, 0x80000000 | 14,   17,    2,    2,
    QMetaType::Void, 0x80000000 | 19,    2,
    QMetaType::Void,
    QMetaType::Void, 0x80000000 | 22,   23,
    QMetaType::Void,

       0        // eod
};

void SpellShell::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<SpellShell *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->addSpell((*reinterpret_cast< const SpellItem*(*)>(_a[1]))); break;
        case 1: _t->delSpell((*reinterpret_cast< const SpellItem*(*)>(_a[1]))); break;
        case 2: _t->changeSpell((*reinterpret_cast< const SpellItem*(*)>(_a[1]))); break;
        case 3: _t->clearSpells(); break;
        case 4: _t->clear(); break;
        case 5: _t->selfStartSpellCast((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 6: _t->buffLoad((*reinterpret_cast< const spellBuff*(*)>(_a[1]))); break;
        case 7: _t->buff((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 8: _t->action((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 9: _t->simpleMessage((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 10: _t->spellMessage((*reinterpret_cast< QString(*)>(_a[1]))); break;
        case 11: _t->zoneChanged(); break;
        case 12: _t->killSpawn((*reinterpret_cast< const Item*(*)>(_a[1]))); break;
        case 13: _t->timeout(); break;
        default: ;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        {
            using _t = void (SpellShell::*)(const SpellItem * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&SpellShell::addSpell)) {
                *result = 0;
                return;
            }
        }
        {
            using _t = void (SpellShell::*)(const SpellItem * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&SpellShell::delSpell)) {
                *result = 1;
                return;
            }
        }
        {
            using _t = void (SpellShell::*)(const SpellItem * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&SpellShell::changeSpell)) {
                *result = 2;
                return;
            }
        }
        {
            using _t = void (SpellShell::*)();
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&SpellShell::clearSpells)) {
                *result = 3;
                return;
            }
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject SpellShell::staticMetaObject = { {
    QMetaObject::SuperData::link<QObject::staticMetaObject>(),
    qt_meta_stringdata_SpellShell.data,
    qt_meta_data_SpellShell,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *SpellShell::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *SpellShell::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_SpellShell.stringdata0))
        return static_cast<void*>(this);
    return QObject::qt_metacast(_clname);
}

int SpellShell::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QObject::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 14)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 14;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 14)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 14;
    }
    return _id;
}

// SIGNAL 0
void SpellShell::addSpell(const SpellItem * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 0, _a);
}

// SIGNAL 1
void SpellShell::delSpell(const SpellItem * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 1, _a);
}

// SIGNAL 2
void SpellShell::changeSpell(const SpellItem * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 2, _a);
}

// SIGNAL 3
void SpellShell::clearSpells()
{
    QMetaObject::activate(this, &staticMetaObject, 3, nullptr);
}
QT_WARNING_POP
QT_END_MOC_NAMESPACE
