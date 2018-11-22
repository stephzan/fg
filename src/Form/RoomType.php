<?php

namespace App\Form;

use App\Entity\Room;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Translation\TranslatorInterface;

class RoomType extends AbstractType
{
    public function __construct(TranslatorInterface $translator)
    {
        $this->tr = $translator;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder            
            ->add('name', TextType::class, ['label' => $this->tr->trans('Name'), 'attr'=>['placeholder'=>$this->tr->trans('Name')]])
            ->add('nbSeats', ChoiceType::class, ['label' => $this->tr->trans('Number of seats'), 'choices' => $this->getChoices('nbSeats') ])
            ->add('private', CheckboxType::class, ['required' => false, 'label' => $this->tr->trans('Private'), 'attr'=>['placeholder'=>$this->tr->trans('Private'), 'class'=>'check_room_private', 'false-value'=>'0', 'value'=>'1']])
            ->add('password', PasswordType::class, ['required' => false, 'empty_data' => '', 'label' => $this->tr->trans('Password'), 'attr'=>['placeholder'=>$this->tr->trans('Password')]])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Room::class,
        ]);
    }

    private function getChoices($type){
        switch($type){
            case 'nbSeats':
                return ['2 (minimum)'=>2, '3'=>3, '4'=>4, '5'=>5, '6'=>6, '7'=>7, '8'=>8];
                break;
        }
    }
}
